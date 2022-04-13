const { error, success } = require("../utils/baseController");
const { logger } = require("../utils/logger");
const Notification = require("../service/Notification");

exports.getUserNotifications = async (req, res) => {
  try {
    const notification = await new Notification({
      userId: req.user._id,
      id: req.params.id,
    }).getUserNotification();
    return success(res, { notification });
  } catch (err) {
    logger.error("Unable to get user notification", err);
    return error(res, { code: err.code, message: err.message });
  }
};

exports.getAllUserNotifications = async (req, res) => {
  try {
    const notifications = await new Notification(
      req.user._id
    ).getAllUserNotifications();
    return success(res, { notifications });
  } catch (err) {
    logger.error(`Error getting user  notification. ${err}`);
    return error(res, { code: err.code, message: err.message });
  }
};

exports.getNotification = async (req, res) => {
  try {
    const notification = await new Notification(
      req.params.id
    ).getNotification();
    return success(res, { notification });
  } catch (err) {
    logger.error("Unable to get notification", err);
    return error(res, { code: err.code, message: err.message });
  }
};

// delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await new Notification(
      req.params.id
    ).deleteNotification();
    return success(res, { notification });
  } catch (err) {
    logger.error("Unable to delete notification", err);
    return error(res, { code: err.code, message: err.message });
  }
};

// get all business and individual notifications
exports.getAllBusinessAndIndividualNotifications = async (req, res) => {
  try {
    const notifications = await new Notification(
      req.user._id
    ).getAllBusinessAndIndividualNotifications();
    return success(res, { notifications });
  } catch (err) {
    logger.error(`Error getting user  notification. ${err}`);
    return error(res, { code: err.code, message: err.message });
  }
};
