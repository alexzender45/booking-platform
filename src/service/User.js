const UserSchema = require("../models/userModel");
const { throwError } = require("../utils/handleErrors");
const bcrypt = require("bcrypt");
const util = require("../utils/util");
const { validateParameters } = require("../utils/util");
const { getCachedData } = require("../service/Redis");
const Wallet = require("./Wallet");
const ApartmentSchema = require("../models/apartmentModel");
const {
  sendResetPasswordToken,
  SuccessfulPasswordReset,
} = require("../utils/sendgrid");
const { USER_TYPE } = require("../utils/constants");

class User {
  constructor(data) {
    this.data = data;
    this.errors = [];
  }

  getUserWithPhoneEmail() {
    const user = UserSchema.findOne({
      $or: [{ phoneNumber: this.data }, { email: this.data }],
    });
    return user ? user : throwError("Individual Not Found", 404);
  }

  async emailExist() {
    const existingUser = await UserSchema.findOne({
      email: this.data.email,
    }).exec();
    if (existingUser) {
      this.errors.push("Email already taken");
      return { emailExist: true, user: existingUser };
    }
    return { emailExist: false };
  }

  async phoneNumberExist() {
    const findPhoneNumber = await UserSchema.findOne({
      phoneNumber: this.data.phoneNumber,
    }).exec();
    if (findPhoneNumber) {
      this.errors.push("Phone Number already taken");
      return true;
    }
    return false;
  }

  async signup() {
    const otp = this.data.otp;
    const { isValid, messages } = validateParameters(
      ["phoneNumber", "email", "password"],
      this.data
    );
    if (!isValid) {
      throwError(messages);
    }
    if (this.data.googleSigned === "false") {
      if (!otp) {
        throwError("OTP Required To Complete Signup");
      }
      const cachedOTP = await getCachedData(this.data.email);
      if (!cachedOTP) {
        throwError("OTP Code Expired");
      } else if (cachedOTP !== otp) {
        throwError("Invalid OTP");
      }
    }
    await Promise.all([this.emailExist(), this.phoneNumberExist()]);
    if (this.errors.length) {
      throwError(this.errors);
    }
    if (this.data.role === USER_TYPE.USER) {
      this.data.isVerified = true;
    }
    const newUser = await new UserSchema(this.data).save();
    const wallet = await new Wallet({ userId: newUser._id }).createWallet();
    if (newUser.role !== USER_TYPE.USER) {
      wallet.withdrawableBalance = 0;
      wallet.save();
    }
    return newUser;
  }

  async login() {
    const { loginId, password } = this.data;
    const validParameters = validateParameters(
      ["loginId", "password"],
      this.data
    );
    const { isValid, messages } = validParameters;

    if (!isValid) {
      throwError(messages);
    }
    return await UserSchema.findByCredentials(loginId, password);
  }

  static async getAllUser() {
    return await UserSchema.find()
      .sort({ createdAt: -1 })
      .orFail(() => throwError("No event found"));
  }

  async userProfile() {
    return await UserSchema.findById(this.data).orFail(() =>
      throwError("No user found")
    );
  }

  async updateUserDetails() {
    const { newDetails, oldDetails } = this.data;
    const updates = Object.keys(newDetails);
    const allowedUpdates = [
      "fullName",
      "email",
      "phoneNumber",
      "state",
      "country",
      "city",
      "gender",
      "companyName",
      "companyAddress",
      "profilePicture",
      "validId",
      "cacDocument",
      "businessName",
      "businessAddress",
    ];
    return await util.performUpdate(
      updates,
      newDetails,
      allowedUpdates,
      oldDetails
    );
  }

  async forgotPassword() {
    const { email } = this.data;
    const verificationCode = Math.floor(100000 + Math.random() * 100000);
    if (!email) {
      throwError("Please Input Your Email");
    }
    const updateUser = await UserSchema.findOneAndUpdate(
      {
        email,
      },
      { token: verificationCode },
      { new: true }
    );
    if (!updateUser) {
      throwError("Invalid Email");
    }
    if (updateUser.role === USER_TYPE.BUSINESS) {
      await sendResetPasswordToken(
        updateUser.email,
        updateUser.businessName,
        updateUser.token
      );
    } else {
      await sendResetPasswordToken(
        updateUser.email,
        updateUser.fullName,
        updateUser.token
      );
    }
    return updateUser;
  }

  async resetPassword() {
    const { token, newPassword } = this.data;
    if (!token || !newPassword) {
      throwError("Please Input Your Token and New Password");
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    const updateUser = await UserSchema.findOneAndUpdate(
      {
        token,
      },
      { token: null, password: hashed },
      { new: true }
    );
    if (!updateUser) {
      throwError("Invalid Token");
    }
    await SuccessfulPasswordReset(updateUser.firstName, updateUser.email);
    return updateUser;
  }

  //delete a user from the database
  async deleteUser() {
    //delete user wallet
    const wallet = await Wallet.findOne({ userId: this.data });
    if (wallet) {
      await wallet.remove();
    }
    const user = await UserSchema.findByIdAndRemove(this.data);
    return user;
  }

  //get user wallet
  async getUserWallet() {
    return await Wallet.findOne({ userId: this.data }).orFail(() =>
      throwError("User Not Found", 404)
    );
  }

  // user can see all active and available apartments
  async getActiveApartment() {
    const apartments = await ApartmentSchema.find({
      isAvailable: true,
      isActive: true,
    });
    return apartments;
  }

  // get user by id
  async getUser() {
    return await UserSchema.findById(this.data).orFail(() =>
      throwError("User Not Found", 404)
    );
  }
}

module.exports = User;
