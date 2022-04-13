const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const walletSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    availableBalance: {
      type: Number,
      default: 0,
    },
    withdrawableBalance: {
      type: Number,
    },
    label: {
      type: String,
    },
    frozen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamp: true,
  }
);

walletSchema.plugin(uniqueValidator, { message: "{TYPE} must be unique." });

const walletModel = model("Wallet", walletSchema);
module.exports = walletModel;
