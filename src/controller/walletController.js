const { error, success } = require("../utils/baseController");
const { logger } = require("../utils/logger");
const Wallet = require("../service/Wallet");

exports.getUserWallet = async (req, res) => {
  try {
    const wallet = await new Wallet(req.user._id).getUserWallet();
    return success(res, { wallet });
  } catch (err) {
    logger.error("Unable to get user wallet", err);
    return error(res, { code: err.code, message: err.message });
  }
};

exports.fundWallet = async (req, res) => {
  const userId = req.user._id;
  req.body["userId"] = userId;
  try {
    const transaction = await new Wallet(req.body).fundWallet();
    return success(res, { transaction });
  } catch (err) {
    logger.error(`Error crediting user ${userId} wallet. Error:`, err);
    return error(res, { code: err.code, message: err.message });
  }
};

exports.debitWallet = async (req, res) => {
  const userId = req.user._id;
  req.body["userId"] = userId;
  try {
    const transaction = await new Wallet(req.body).debitWallet();
    return success(res, { transaction });
  } catch (err) {
    logger.error(`Error debiting user ${userId} wallet. Error:`, err);
    return error(res, { code: err.code, message: err.message });
  }
};

exports.withdrawFund = async (req, res) => {
  const userId = req.user._id;
  req.body["userId"] = userId;
  try {
    const withdrawal = await new Wallet(req.body).withdrawFund();
    return success(res, { withdrawal });
  } catch (err) {
    logger.error(
      `Error withdrawing user [${userId}] funds to bank account. Error:`,
      err
    );
    return error(res, { code: err.code, message: err.message });
  }
};

// verify fund transfer
exports.verifyFundTransfer = async (req, res) => {
  try {
    const transaction = await new Wallet(
      req.params.reference
    ).verifyFundTransfer();
    return success(res, { transaction });
  } catch (err) {
    logger.error(`Error verifying fund transfer. Error:`, err);
    return error(res, { code: err.code, message: err.message });
  }
};
