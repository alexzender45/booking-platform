const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const eventSchema = new Schema({
  eventName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  eventCost: {
    type: Number,
    required: true,
  },
  eventLocation: {
    type: String,
    required: true,
  },
  eventCountry: {
    type: String,
    required: true,
  },
  eventState: {
    type: String,
    required: true,
  },
  eventImages: {
    type: Array,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  eventDate: {
    type: String,
    required: true,
  },
  eventTime: {
    type: String,
    required: true,
  },
});

eventSchema.plugin(uniqueValidator, { message: "{TYPE} must be unique." });

const Event = model("Event", eventSchema);
module.exports = Event;
