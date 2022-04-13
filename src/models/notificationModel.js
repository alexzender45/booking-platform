const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { NOTIFICATION_TYPE } = require("../utils/constants");

const notificationSchema = new Schema(
  {
    bookingUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    apartmentOwnerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    apartmentId: {
      type: Schema.Types.ObjectId,
      ref: "Apartment",
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
    },
    notificationType: {
      type: String,
      enum: Object.keys(NOTIFICATION_TYPE),
    },
    price: {
      type: Number,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamp: true,
  }
);

notificationSchema.plugin(uniqueValidator, {
  message: "{TYPE} must be unique.",
});

const notificationModel = model("Notification", notificationSchema);
module.exports = notificationModel;
