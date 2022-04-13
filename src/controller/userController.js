const { error, success } = require("../utils/baseController");
const { generateAuthToken } = require("../core/userAuth");
const { logger } = require("../utils/logger");
const { USER_TYPE } = require("../utils/constants");
const User = require("../service/User");

exports.signup = async (req, res) => {
  try {
    const newUser = await new User(req.body).signup();
    const token = await generateAuthToken({
      userId: newUser._id,
      isVerified: newUser.isVerified,
      role: newUser.role,
    });
    return success(res, { newUser, token });
  } catch (err) {
    logger.error("Error occurred at signup", err);
    return error(res, { code: err.code, message: err });
  }
};

exports.login = async (req, res) => {
  try {
    const userDetails = await new User(req.body).login();
    const token = await generateAuthToken({
      userId: userDetails._id,
      isVerified: userDetails.isVerified,
      role: userDetails.role,
    });
    return success(res, { userDetails, token });
  } catch (err) {
    logger.error("Error occurred at login", err.message);
    return error(res, { code: err.code, message: err.message });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.getAllUser();
    return success(res, { users });
  } catch (err) {
    logger.error("Unable to complete request", err);
    return error(res, { code: err.code, message: err.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await new User(req.user._id).userProfile();
    return success(res, { user });
  } catch (err) {
    logger.error("Unable to complete fetch user profile request", err);
    return error(res, { code: err.code, message: err.message });
  }
};

exports.updateUserDetails = async (req, res) => {
  try {
    const newDetails = req.body;
    const oldDetails = req.user;
    const user = await new User({ newDetails, oldDetails }).updateUserDetails();
    return success(res, { user });
  } catch (err) {
    logger.error("Unable to complete user update request", err);
    return error(res, { code: err.code, message: err.message });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    const originalname = req.files[0].originalname;
    const path = req.files[0].path;
    const userId = req.user._id;
    const user = await new User({
      originalname,
      path,
      userId,
    }).uploadProfileImage();
    return success(res, { user });
  } catch (err) {
    logger.error("Unable to complete host update request", err);
    return error(res, { code: err.code, message: err.message });
  }
};

// delete user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await new User(userId).deleteUser();
    return success(res, { user });
  } catch (err) {
    logger.error("Unable to complete host update request", err);
    return error(res, { code: err.code, message: err.message });
  }
};

exports.forgotPassword = (req, res) => {
  new User(req.body)
    .forgotPassword()
    .then((data) =>
      success(res, {
        status: "success",
        success: true,
        message: "Token Has Been Sent To Your Email",
      })
    )
    .catch((err) => error(res, { code: err.code, message: err.message }));
};

exports.resetPassword = (req, res) => {
  new User(req.body)
    .resetPassword()
    .then((data) =>
      success(res, {
        status: "success",
        success: true,
        message: "Password Reset Successful",
      })
    )
    .catch((err) => error(res, { code: err.code, message: err.message }));
};

// get user wallet
exports.getUserWallet = async (req, res) => {
  try {
    const user = await new User(req.user._id).getUserWallet();
    return success(res, { user });
  } catch (err) {
    logger.error("Unable to complete request", err);
    return error(res, { code: err.code, message: err.message });
  }
};

// get all active apartments
exports.getActiveApartment = async (req, res) => {
  try {
    const apartments = await new User().getActiveApartment();
    return success(res, { apartments });
  } catch (err) {
    logger.error("Unable to complete request", err);
    return error(res, { code: err.code, message: err.message });
  }
};

// get user by id
exports.getUser = async (req, res) => {
  try {
    const user = await new User(req.params.id).getUser();
    return success(res, { user });
  } catch (err) {
    logger.error("Unable to complete request", err);
    return error(res, { code: err.code, message: err.message });
  }
};
