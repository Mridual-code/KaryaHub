const mongoose = require("mongoose");

const ActivityLog = require(
  "../models/ActivityLog"
);

/*
|--------------------------------------------------------------------------
| Get All Activity Logs
|--------------------------------------------------------------------------
| Admin only
|
| Supported query parameters:
| page
| limit
| search
| module
| action
| performedBy
| startDate
| endDate
|--------------------------------------------------------------------------
*/

const getActivityLogs = async (
  req,
  res
) => {
  try {
    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number(req.query.limit) || 10,
        1
      ),
      100
    );

    const skip = (page - 1) * limit;

    const {
      search,
      module,
      action,
      performedBy,
      startDate,
      endDate
    } = req.query;

    const filter = {};

    if (module) {
      filter.module = module;
    }

    if (action) {
      filter.action = action;
    }

    if (performedBy) {
      if (
        !mongoose.Types.ObjectId.isValid(
          performedBy
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid performedBy user ID"
        });
      }

      filter.performedBy = performedBy;
    }

    if (search?.trim()) {
      filter.description = {
        $regex: search.trim(),
        $options: "i"
      };
    }

    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) {
        const parsedStartDate =
          new Date(startDate);

        if (
          Number.isNaN(
            parsedStartDate.getTime()
          )
        ) {
          return res.status(400).json({
            message:
              "Invalid start date"
          });
        }

        parsedStartDate.setHours(
          0,
          0,
          0,
          0
        );

        filter.createdAt.$gte =
          parsedStartDate;
      }

      if (endDate) {
        const parsedEndDate =
          new Date(endDate);

        if (
          Number.isNaN(
            parsedEndDate.getTime()
          )
        ) {
          return res.status(400).json({
            message: "Invalid end date"
          });
        }

        parsedEndDate.setHours(
          23,
          59,
          59,
          999
        );

        filter.createdAt.$lte =
          parsedEndDate;
      }
    }

    const [
      activityLogs,
      totalLogs
    ] = await Promise.all([
      ActivityLog.find(filter)
        .populate(
          "performedBy",
          "name email role"
        )
        .sort({
          createdAt: -1
        })
        .skip(skip)
        .limit(limit),

      ActivityLog.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(
      totalLogs / limit
    );

    return res.status(200).json({
      message:
        "Activity logs fetched successfully",

      activityLogs,

      pagination: {
        currentPage: page,
        totalPages,
        totalLogs,
        limit,
        hasNextPage:
          page < totalPages,
        hasPreviousPage:
          page > 1
      }
    });
  } catch (error) {
    console.error(
      "Get activity logs error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch activity logs"
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Single Activity Log
|--------------------------------------------------------------------------
| Admin only
|--------------------------------------------------------------------------
*/

const getActivityLogById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message:
          "Invalid activity log ID"
      });
    }

    const activityLog =
      await ActivityLog.findById(id)
        .populate(
          "performedBy",
          "name email role"
        );

    if (!activityLog) {
      return res.status(404).json({
        message:
          "Activity log not found"
      });
    }

    return res.status(200).json({
      message:
        "Activity log fetched successfully",

      activityLog
    });
  } catch (error) {
    console.error(
      "Get activity log error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch activity log"
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Recent Activity Logs
|--------------------------------------------------------------------------
| Admin only
|--------------------------------------------------------------------------
*/

const getRecentActivityLogs = async (
  req,
  res
) => {
  try {
    const requestedLimit =
      Number(req.query.limit) || 10;

    const limit = Math.min(
      Math.max(requestedLimit, 1),
      50
    );

    const activityLogs =
      await ActivityLog.find()
        .populate(
          "performedBy",
          "name email role"
        )
        .sort({
          createdAt: -1
        })
        .limit(limit);

    return res.status(200).json({
      message:
        "Recent activity logs fetched successfully",

      activityLogs
    });
  } catch (error) {
    console.error(
      "Recent activity logs error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch recent activity logs"
    });
  }
};

/*
|--------------------------------------------------------------------------
| Activity Log Statistics
|--------------------------------------------------------------------------
| Admin only
|--------------------------------------------------------------------------
*/

const getActivityLogStats = async (
  req,
  res
) => {
  try {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    const [
      totalLogs,
      todayLogs,
      moduleStats,
      actionStats
    ] = await Promise.all([
      ActivityLog.countDocuments(),

      ActivityLog.countDocuments({
        createdAt: {
          $gte: today,
          $lt: tomorrow
        }
      }),

      ActivityLog.aggregate([
        {
          $group: {
            _id: "$module",
            count: {
              $sum: 1
            }
          }
        },
        {
          $project: {
            _id: 0,
            module: "$_id",
            count: 1
          }
        },
        {
          $sort: {
            count: -1
          }
        }
      ]),

      ActivityLog.aggregate([
        {
          $group: {
            _id: "$action",
            count: {
              $sum: 1
            }
          }
        },
        {
          $project: {
            _id: 0,
            action: "$_id",
            count: 1
          }
        },
        {
          $sort: {
            count: -1
          }
        }
      ])
    ]);

    return res.status(200).json({
      message:
        "Activity log statistics fetched successfully",

      stats: {
        totalLogs,
        todayLogs,
        moduleStats,
        actionStats
      }
    });
  } catch (error) {
    console.error(
      "Activity log statistics error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch activity log statistics"
    });
  }
};

/*
|--------------------------------------------------------------------------
| Delete Single Activity Log
|--------------------------------------------------------------------------
| Admin only
|--------------------------------------------------------------------------
*/

const deleteActivityLog = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message:
          "Invalid activity log ID"
      });
    }

    const activityLog =
      await ActivityLog.findByIdAndDelete(
        id
      );

    if (!activityLog) {
      return res.status(404).json({
        message:
          "Activity log not found"
      });
    }

    return res.status(200).json({
      message:
        "Activity log deleted successfully"
    });
  } catch (error) {
    console.error(
      "Delete activity log error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to delete activity log"
    });
  }
};

/*
|--------------------------------------------------------------------------
| Clear Activity Logs
|--------------------------------------------------------------------------
| Admin only
|
| Optional:
| DELETE /api/activity-logs/clear?before=2026-01-01
|
| Without before:
| Deletes every activity log.
|--------------------------------------------------------------------------
*/

const clearActivityLogs = async (
  req,
  res
) => {
  try {
    const { before } = req.query;

    const filter = {};

    if (before) {
      const beforeDate = new Date(before);

      if (
        Number.isNaN(
          beforeDate.getTime()
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid before date"
        });
      }

      beforeDate.setHours(
        23,
        59,
        59,
        999
      );

      filter.createdAt = {
        $lte: beforeDate
      };
    }

    const result =
      await ActivityLog.deleteMany(
        filter
      );

    return res.status(200).json({
      message:
        "Activity logs cleared successfully",

      deletedCount:
        result.deletedCount
    });
  } catch (error) {
    console.error(
      "Clear activity logs error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to clear activity logs"
    });
  }
};

module.exports = {
  getActivityLogs,
  getActivityLogById,
  getRecentActivityLogs,
  getActivityLogStats,
  deleteActivityLog,
  clearActivityLogs
};