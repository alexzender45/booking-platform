const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { BOOKING_STATUS, PAYMENT_STATUS } = require("../utils/constants");

const bookingSchema = new Schema(
  {
    apartmentOwnerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    bookingUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    apartmentId: {
      type: Schema.Types.ObjectId,
      ref: "Apartment",
      required: true,
      index: true,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: Object.keys(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING,
    },
    bookingAmount: {
      type: Number,
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    numberOfGuests: {
      type: Number,
      required: true,
    },
    dateList: {
      type: [Date],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    paystackReference: {
      type: String,
    },
    paystackUrl: {
      type: String,
    },
    paymentMethod: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: Object.keys(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
    paymentDate: {
      type: Date,
    },
    bookingOrderId: {
      type: String,
    },
  },
  {
    strictQuery: "throw",
  }
);

bookingSchema.plugin(uniqueValidator, { message: "{TYPE} must be unique." });

const BookingModel = model("Booking", bookingSchema);
module.exports = BookingModel;
