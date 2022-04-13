const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const apartmentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  apartmentName: {
    type: String,
    required: true,
  },
  apartmentState: {
    type: String,
    required: true,
  },
  apartmentCountry: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  typeOfApartment: {
    type: String,
    required: true,
  },
  facilities: {
    type: Array,
  },
  apartmentInfo: {
    type: String,
    required: true,
  },
  apartmentImages: {
    type: Array,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  numberOfRooms: {
    type: Number,
    required: true,
  },
});

apartmentSchema.plugin(uniqueValidator, { message: "{TYPE} must be unique." });

const Apartment = model("Apartment", apartmentSchema);
module.exports = Apartment;
