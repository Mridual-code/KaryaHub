const Notification = require(
  "../models/Notification"
);
const User = require("../models/User");

const createNotification = async ({
  recipient,
  sender = null,
  title,
  message,
  type = "General",
  relatedId = null,
  relatedModel = null,
  targetUrl = ""
}) => {
  try {
    if (!recipient || !title || !message) {
      console.warn(
        "Notification skipped: required fields missing"
      );

      return null;
    }

    const notification =
      await Notification.create({
        recipient,
        sender,
        title,
        message,
        type,
        relatedId,
        relatedModel,
        targetUrl
      });

    return notification;
  } catch (error) {
    console.error(
      "Create notification error:",
      error.message
    );

    return null;
  }
};

const createBulkNotifications = async ({
  recipients,
  sender = null,
  title,
  message,
  type = "General",
  relatedId = null,
  relatedModel = null,
  targetUrl = ""
}) => {
  try {
    const uniqueRecipients = [
      ...new Set(
        recipients
          .filter(Boolean)
          .map((id) => id.toString())
      )
    ];

    if (
      uniqueRecipients.length === 0 ||
      !title ||
      !message
    ) {
      return [];
    }

    const notifications =
      uniqueRecipients.map((recipient) => ({
        recipient,
        sender,
        title,
        message,
        type,
        relatedId,
        relatedModel,
        targetUrl
      }));

    return await Notification.insertMany(
      notifications
    );
  } catch (error) {
    console.error(
      "Bulk notification error:",
      error.message
    );

    return [];
  }
};

const notifyAdmins = async ({
  sender = null,
  title,
  message,
  type = "General",
  relatedId = null,
  relatedModel = null,
  targetUrl = ""
}) => {
  try {
    const admins = await User.find({
      role: "Admin"
    }).select("_id");

    const adminIds = admins.map(
      (admin) => admin._id
    );

    return await createBulkNotifications({
      recipients: adminIds,
      sender,
      title,
      message,
      type,
      relatedId,
      relatedModel,
      targetUrl
    });
  } catch (error) {
    console.error(
      "Notify admins error:",
      error.message
    );

    return [];
  }
};

module.exports = {
  createNotification,
  createBulkNotifications,
  notifyAdmins
};