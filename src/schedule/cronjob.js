const cron = require("node-cron");
const { DAILY_CRON_SCHEDULE } = require("../core/config");
const BookingSchema = require("../models/bookingModel");
const { BOOKING_STATUS, NOTIFICATION_TYPE } = require("../utils/constants");
const Notification = require("../service/Notification");

cron.schedule(DAILY_CRON_SCHEDULE, async () => {
  console.log("Cron started");
  const bookings = await BookingSchema.find({
    bookingStatus: BOOKING_STATUS.PENDING,
  });
  bookings.forEach(async (booking) => {
    // createdAt is a more than 24 hours old booking
    if (booking.createdAt < Date.now() - 24 * 60 * 60 * 1000) {
      const cancelBooking = await BookingSchema.findByIdAndUpdate(booking._id, {
        bookingStatus: BOOKING_STATUS.CANCELLED,
      }).populate("apartmentId", "apartmentName apartmentImages");
      const notificationDetails = {
        bookingUserId: booking.bookingUserId,
        bookingId: booking._id,
        message: `${cancelBooking.apartmentId.apartmentName} Booking has been cancelled due to no payment before 24hours from booking date.`,
        image: cancelBooking.apartmentId.apartmentImages[0],
        price: booking.bookingAmount,
        apartmentId: cancelBooking.apartmentId._id,
        notificationType: NOTIFICATION_TYPE.BOOKING_CANCELLATION,
      };
      Notification.createNotification(notificationDetails);
    }
  });
});
