const mongoose = require("mongoose");
const Notification = require(
  "../models/Notification"
);

const getMyNotifications = async (
  req,
  res
) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      isRead,
      search
    } = req.query;

    const pageNumber = Math.max(
      Number(page) || 1,
      1
    );

    const limitNumber = Math.min(
      Math.max(Number(limit) || 20, 1),
      100
    );

    const filter = {
      recipient: req.user._id
    };

    if (type) {
      filter.type = type;
    }

    if (
      isRead === "true" ||
      isRead === "false"
    ) {
      filter.isRead = isRead === "true";
    }

    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i"
          }
        },
        {
          message: {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }

    const total =
      await Notification.countDocuments(
        filter
      );

    const notifications =
      await Notification.find(filter)
        .populate(
          "sender",
          "name email role"
        )
        .sort({ createdAt: -1 })
        .skip(
          (pageNumber - 1) *
            limitNumber
        )
        .limit(limitNumber);

    res.status(200).json({
      success: true,
      total,
      page: pageNumber,
      pages: Math.ceil(
        total / limitNumber
      ),
      notifications
    });
  } catch (error) {
    console.error(
      "Get notifications error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch notifications"
    });
  }
};

const getUnreadNotificationCount =
  async (req, res) => {
    try {
      const unreadCount =
        await Notification.countDocuments({
          recipient: req.user._id,
          isRead: false
        });

      res.status(200).json({
        success: true,
        unreadCount
      });
    } catch (error) {
      console.error(
        "Unread count error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch unread count"
      });
    }
  };

const getNotificationById = async (
  req,
  res
) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid notification ID"
      });
    }

    const notification =
      await Notification.findOne({
        _id: req.params.id,
        recipient: req.user._id
      }).populate(
        "sender",
        "name email role"
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message:
          "Notification not found"
      });
    }

    res.status(200).json({
      success: true,
      notification
    });
  } catch (error) {
    console.error(
      "Get notification error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch notification"
    });
  }
};

const markNotificationAsRead = async (
  req,
  res
) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid notification ID"
      });
    }

    const notification =
      await Notification.findOne({
        _id: req.params.id,
        recipient: req.user._id
      });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message:
          "Notification not found"
      });
    }

    notification.isRead = true;
    notification.readAt = new Date();

    await notification.save();

    res.status(200).json({
      success: true,
      message:
        "Notification marked as read",
      notification
    });
  } catch (error) {
    console.error(
      "Mark notification error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update notification"
    });
  }
};

const markAllNotificationsAsRead =
  async (req, res) => {
    try {
      const result =
        await Notification.updateMany(
          {
            recipient: req.user._id,
            isRead: false
          },
          {
            $set: {
              isRead: true,
              readAt: new Date()
            }
          }
        );

      res.status(200).json({
        success: true,
        message:
          "All notifications marked as read",
        updatedCount:
          result.modifiedCount
      });
    } catch (error) {
      console.error(
        "Mark all notifications error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update notifications"
      });
    }
  };

const deleteNotification = async (
  req,
  res
) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid notification ID"
      });
    }

    const notification =
      await Notification.findOneAndDelete({
        _id: req.params.id,
        recipient: req.user._id
      });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message:
          "Notification not found"
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Notification deleted successfully"
    });
  } catch (error) {
    console.error(
      "Delete notification error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete notification"
    });
  }
};

const clearMyNotifications = async (
  req,
  res
) => {
  try {
    const result =
      await Notification.deleteMany({
        recipient: req.user._id
      });

    res.status(200).json({
      success: true,
      message:
        "All notifications cleared",
      deletedCount:
        result.deletedCount
    });
  } catch (error) {
    console.error(
      "Clear notifications error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to clear notifications"
    });
  }
};

module.exports = {
  getMyNotifications,
  getUnreadNotificationCount,
  getNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearMyNotifications
};