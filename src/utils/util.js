const { resetPasswordMessage } = require("./messages");
const { generateAuthToken } = require("../core/userAuth");
const { throwError } = require("./handleErrors");
const { s3 } = require("./aws");
const { EMAIL_SENDER } = require("../core/config");
const { error, success } = require("../utils/baseController");
const msg = require("./sendgrid");

exports.validateParameters = (expectedParameters, actualParameters) => {
  const messages = [];
  let isValid = true;

  if (!actualParameters) {
    throwError("Invalid Parameters");
  }

  expectedParameters.forEach((parameter) => {
    const actualParameter = actualParameters[parameter];

    if (!actualParameter || actualParameter === "") {
      messages.push(`${parameter} is required`);
      isValid = false;
    }
  });
  return { isValid, messages };
};

exports.sendEmail = (to, subject, html) => {
  return { from: EMAIL_SENDER, to, subject, html };
};

exports.uploadResourceToS3Bucket = (params) => {
  return s3
    .upload(params)
    .promise()
    .then((data) => data.Location)
    .catch((error) => {
      if (error) {
        throw error;
      }
    });
};

exports.getAttachmentSizeInMegabyte = (sizeInByte) => {
  let sizeInMegaByte = sizeInByte / 1000000;
  return +(Math.round(sizeInMegaByte + "e+3") + "e-3") + "mb";
};

exports.performUpdate = async (
  updates,
  newDetails,
  allowedUpdates,
  oldDetails
) => {
  let invalidField;
  const isValidUpdate = updates.every((update) => {
    if (newDetails[update] === "")
      throwError(`Invalid value supplied for ${update}`);
    invalidField = update;
    return allowedUpdates.includes(update);
  });

  if (!isValidUpdate) {
    throwError(`Invalid Field ${invalidField}`);
  }

  updates.map((update) => {
    oldDetails[update] = newDetails[update];
  });

  return await oldDetails.save();
};
exports.processForgotPassword = async (user, res) => {
  const token = await generateAuthToken({ userId: user._id });
  const htmlMessage = resetPasswordMessage(token);
  const mail = this.sendEmail(user.email, "Password Reset", htmlMessage);
  const updatedUser = await user.save({ resetLink: token });
  if (updatedUser) {
    try {
      const sendMessage = await msg.messages().send(mail);
      if (sendMessage) {
        return success(
          res,
          { status: "success", success: true, user: updatedUser },
          "Check your email and follow the instruction to reset your password."
        );
      }
    } catch (err) {
      return error(res, { code: 500, message: err.message });
    }
  }
};
