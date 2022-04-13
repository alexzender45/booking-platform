const NotificationSchema = require("../models/notificationModel");
const { throwError } = require("../utils/handleErrors");

class Notification {
  constructor(data) {
    this.data = data;
    this.errors = [];
  }

  static async createNotification(notificationDetails) {
    return await new NotificationSchema(notificationDetails).save();
  }

  async getUserNotification() {
    const { userId, id } = this.data;
    return await NotificationSchema.findOne({ bookingUserId: userId, _id: id })
      .populate(
        "bookingId apartmentId",
        "apartmentName apartmentImages bookingAmount bookingStatus createdAt"
      )
      .orFail(() => throwError("User Notification Not Found"));
  }

  async getAllUserNotifications() {
    return await NotificationSchema.find({ bookingUserId: this.data })
      .sort({ createdAt: -1 })
      .populate(
        "bookingId apartmentId",
        "apartmentName apartmentImages bookingAmount bookingStatus createdAt"
      )
      .orFail(() => throwError("No Notification Found"));
  }

  async getAllBusinessAndIndividualNotifications() {
    return await NotificationSchema.find({ apartmentOwnerId: this.data })
      .sort({ createdAt: -1 })
      .populate(
        "bookingId apartmentId",
        "apartmentName apartmentImages bookingAmount bookingStatus createdAt"
      )
      .orFail(() => throwError("No Notification Found"));
  }

  async getNotification() {
    const notification = await NotificationSchema.findOne({ _id: this.data })
      .populate(
        "bookingId apartmentId",
        "apartmentName apartmentImages bookingAmount bookingStatus createdAt"
      )
      .orFail(() => throwError("Notification Not Found"));
    if (notification.isRead === false) {
      notification.isRead = true;
      await notification.save();
    }
    return notification;
  }

  // delete notification
  async deleteNotification() {
    return await NotificationSchema.findOneAndDelete({
      _id: this.data,
    }).orFail(() => throwError("Notification Not Found"));
  }
}

module.exports = Notification;
