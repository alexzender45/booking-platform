const { error, success } = require("../utils/baseController");
const { logger } = require("../utils/logger");
const Booking = require("../service/Booking");

// create event
exports.createBooking = async (req, res) => {
  try {
    req.body["bookingUserId"] = req.user._id;
    await new Booking(req.body).createBooking();
    return success(res, { message: "Booking Created Successfully" });
  } catch (err) {
    logger.error("Unable to create booking", err);
    return error(res, { code: err.code, message: err.message });
  }
};

// get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await new Booking().getAllBookings();
    return success(res, { bookings });
  } catch (err) {
    logger.error("Unable to get all bookings", err);
    return error(res, { code: err.code, message: err.message });
  }
};

// get booking by userId
exports.getBookingsByUserId = async (req, res) => {
  try {
    const bookings = await new Booking(req.user._id).getAllBookingsByUser();
    return success(res, { bookings });
  } catch (err) {
    logger.error("Unable to get bookings by userId", err);
    return error(res, { code: err.code, message: err.message });
  }
};

//get booking by userId
exports.getAllBookingsByBusinessOrIndividual = async (req, res) => {
  try {
    const bookings = await new Booking(
      req.user._id
    ).getAllBookingsByBusinessOrIndividual();
    return success(res, { bookings });
  } catch (err) {
    logger.error("Unable to get bookings", err);
    return error(res, { code: err.code, message: err.message });
  }
};

// get booking by id
exports.getBookingById = async (req, res) => {
  try {
    const booking = await new Booking(req.params.bookingId).getBookingById();
    return success(res, { booking });
  } catch (err) {
    logger.error("Unable to get booking by id", err);
    return error(res, { code: err.code, message: err.message });
  }
};

// get booking by apartmentId
exports.getBookingsByApartmentId = async (req, res) => {
  try {
    const bookings = await new Booking(
      req.params.apartmentId
    ).getBookingByApartmentId();
    return success(res, { bookings });
  } catch (err) {
    logger.error("Unable to get bookings by apartmentId", err);
    return error(res, { code: err.code, message: err.message });
  }
};

// cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await new Booking(req.params.bookingId).cancelBooking();
    return success(res, { booking });
  } catch (err) {
    logger.error("Unable to cancel booking", err);
    return error(res, { code: err.code, message: err.message });
  }
};

// pay for pending booking
exports.payForPendingBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const paymentMethod = req.query.paymentMethod;
    const bookingId = req.query.bookingId;
    const booking = await new Booking({
      bookingId,
      paymentMethod,
      userId,
    }).payForPendingBooking();
    return success(res, { booking });
  } catch (err) {
    logger.error("Unable to pay for pending booking", err);
    return error(res, { code: err.code, message: err.message });
  }
};

// verify booking payment
exports.verifyBookingPayment = async (req, res) => {
  try {
    const booking = await new Booking(req.params.reference).verifyBooking();
    return success(res, { booking });
  } catch (err) {
    logger.error("Unable to verify booking payment", err);
    return error(res, { code: err.code, message: err.message });
  }
}
