const { error, success } = require("../utils/baseController");
const { logger } = require("../utils/logger");
const Transaction = require("../service/Transaction");

exports.getUserTransaction = async (req, res) => {
  try {
    const transaction = await new Transaction({
      userId: req.user._id,
      id: req.params.id,
    }).getUserTransaction();
    return success(res, { transaction });
  } catch (err) {
    logger.error("Unable to get user Transaction", err);
    return error(res, { code: err.code, message: err.message });
  }
};

exports.getAllUserTransactions = async (req, res) => {
  try {
    const transactions = await new Transaction(
      req.user._id
    ).getAllUserTransactions();
    return success(res, { transactions });
  } catch (err) {
    logger.error(`Error crediting user ${userId} Transaction. ${err}`);
    return error(res, { code: err.code, message: err.message });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    const transaction = await new Transaction(req.params.id).getTransaction();
    return success(res, { transaction });
  } catch (err) {
    logger.error("Unable to get transaction", err);
    return error(res, { code: err.code, message: err.message });
  }
};

exports.getTransactionByReference = async (req, res) => {
  try {
    const transaction = await new Transaction(
      req.params.reference
    ).getTransactionByReference();
    return success(res, { transaction });
  } catch (err) {
    logger.error("Unable to get transaction", err);
    return error(res, { code: err.code, message: err.message });
  }
};
