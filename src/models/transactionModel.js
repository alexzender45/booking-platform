const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { TRANSACTION_STATUS, TRANSACTION_TYPE } = require("../utils/constants");

const transactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: TRANSACTION_STATUS.SUCCESS,
      enum: Object.keys(TRANSACTION_STATUS),
    },
    type: {
      type: String,
      required: true,
      enum: Object.keys(TRANSACTION_TYPE),
    },
    reference: {
      type: String,
      required: true,
    },
    paymentDate: {
      type: String,
      required: true,
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

transactionSchema.plugin(uniqueValidator, {
  message: "{TYPE} must be unique.",
});

const transactionModel = model("Transaction", transactionSchema);
module.exports = transactionModel;
