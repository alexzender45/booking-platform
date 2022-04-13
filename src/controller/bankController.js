const Bank = require("../service/Bank");
const { error, success } = require("../utils/baseController");
const { logger } = require("../utils/logger");

exports.addBank = async (req, res) => {
  try {
    req.body["userId"] = req.user._id;
    const bank = await new Bank(req.body).addBank();
    return success(res, { bank });
  } catch (err) {
    logger.error("Error occurred at creating bank", err);
    return error(res, { code: err.code, message: err.message });
  }
};

exports.getBank = async (req, res) => {
  try {
    const bank = await new Bank(req.params.id).getBank();
    return success(res, { bank });
  } catch (err) {
    logger.error("Unable to fetch bank", err);
    return error(res, { code: err.code, message: err.message });
  }
};

exports.getAllUserBank = async (req, res) => {
  try {
    const banks = await new Bank(req.user._id).getAllUserBank();
    return success(res, { banks });
  } catch (err) {
    logger.error("Unable to complete request", err);
    return error(res, { code: err.code, message: err.message });
  }
};

exports.getDefaultBank = async (req, res) => {
  try {
    const bank = await new Bank(req.user._id).getDefaultBank();
    return success(res, { bank });
  } catch (err) {
    logger.error("Unable to get default bank", err);
    return error(res, { code: err.code, message: err.message });
  }
};

exports.changeDefaultBank = async (req, res) => {
  try {
    const update = await new Bank({
      userId: req.user._id,
      bankId: req.params.id,
    }).changeDefaultBank();
    return success(res, update);
  } catch (err) {
    logger.error("Unable to update default bank", err);
    return error(res, { code: err.code, message: err.message });
  }
};

exports.deleteBank = async (req, res) => {
  try {
    const bank = await new Bank(req.params.id).deleteBank();
    return success(res, { bank });
  } catch (err) {
    logger.error("Unable to delete bank", err);
    return error(res, { code: err.code, message: err.message });
  }
};

exports.getBankList = async (req, res) => {
  try {
    const bankList = await Bank.getBankList();
    return success(res, { bankList });
  } catch (err) {
    logger.error("Unable to get bank list", err);
    return error(res, { code: err.code, message: err.message });
  }
};
