const ActivityLog = require(
  "../models/ActivityLog"
);

const getClientIp = (req) => {
  if (!req) {
    return "";
  }

  const forwardedIp =
    req.headers?.["x-forwarded-for"];

  if (forwardedIp) {
    return forwardedIp
      .split(",")[0]
      .trim();
  }

  return (
    req.ip ||
    req.socket?.remoteAddress ||
    ""
  );
};

const createActivityLog = async ({
  req,
  performedBy,
  action,
  module,
  description,
  targetId = null,
  targetModel = null,
  metadata = {}
}) => {
  try {
    const userId =
      performedBy ||
      req?.user?._id ||
      req?.user?.id;

    if (!userId) {
      console.warn(
        "Activity log skipped: performedBy is missing"
      );

      return null;
    }

    if (
      !action ||
      !module ||
      !description
    ) {
      console.warn(
        "Activity log skipped: required fields are missing"
      );

      return null;
    }

    const activityLog =
      await ActivityLog.create({
        performedBy: userId,
        action,
        module,
        description,
        targetId,
        targetModel,
        metadata,
        ipAddress: getClientIp(req),
        userAgent:
          req?.headers?.["user-agent"] ||
          ""
      });

    return activityLog;
  } catch (error) {
    /*
      Activity logging should not break
      the main Employee, Leave,
      Department or Attendance operation.
    */

    console.error(
      "Failed to create activity log:",
      error.message
    );

    return null;
  }
};

module.exports = {
  createActivityLog
};