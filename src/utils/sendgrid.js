const { SENDGRID_API_KEY, VERIFIED_EMAIL } = require("../core/config");
const sgMail = require("@sendgrid/mail");
const moment = require("moment");
sgMail.setApiKey(SENDGRID_API_KEY);
const { logger } = require("../utils/logger");
const { cacheData } = require("../service/Redis");

const verificationCode = Math.floor(100000 + Math.random() * 100000);

function sendEmailToken(Email, token) {
  const msg = {
    to: Email, // Change to your recipient
    from: VERIFIED_EMAIL, // Change to your verified sender
    subject: "Activation Token",
    html: `<h4>Hello,</h4>
      <p>Please use this <b> ${token} </b> to activate your account </p>
      <p><b>Regards,</b></p>
      <p><b>Pebble Signature</b></p>
      `,
  };
  sgMail
    .send(msg)
    .then((result) => {})
    .catch((error) => {
      console.error(error);
      if (error.response) {
        const { response } = error;
        const { body } = response;
        return body;
      }
    });
}

function sendResetPasswordToken(Email, firstName, token) {
  const msg = {
    to: Email, // Change to your recipient
    from: VERIFIED_EMAIL, // Change to your verified sender
    subject: "Password Reset Token",
    html: `<h4>Hello ${firstName},</h4>
              <p>Please use this <b> ${token} </b> to reset your password </p>
              <p><b>Regards,</b></p>
              <p><b>Pebble Signature</b></p>
              `,
  };
  sgMail
    .send(msg)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.error(error);
      if (error.response) {
        const { response } = error;
        const { body } = response;
        console.error(body);
      }
    });
}

function registrationSuccessful(Email, firstName) {
  const msg = {
    to: Email, // Change to your recipient
    from: VERIFIED_EMAIL, // Change to your verified sender
    subject: "Registration Successful",
    html: `<h4>Hello ${firstName},</h4>
              <p>Thanks for joining Pebble Signature, Your Registration is successful</p>`,
  };
  sgMail
    .send(msg)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.log(error);
      if (error.response) {
        const { response } = error;
        const { body } = response;
        console.error(body);
      }
    });
}

function passwordEmail(Name, Email, link) {
  const msg = {
    to: Email, // Change to your recipient
    from: VERIFIED_EMAIL, // Change to your verified sender
    subject: "Reset Your Password",
    html: `<h1>Dear ${Name},</h1>
        <p>You Have recently asked to reset your Felt-Teachers profile password.</p>
         <p><b>Please follow this link <a href = "${link}">Click Here To Reset Your Password</a></b></p>
        <p>Best Regards,</p>
        <p>Felt-Teachers</p>`,
  };

  sgMail
    .send(msg)
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      // Log friendly error
      console.error(error);

      if (error.response) {
        // Extract error msg
        const { message, code, response } = error;

        // Extract response msg
        const { headers, body } = response;

        console.error(body);
      }
    });
}

function SuccessfulPasswordReset(Name, Email) {
  const msg = {
    to: Email, // Change to your recipient
    from: VERIFIED_EMAIL, // Change to your verified sender
    subject: "Your Password Reset Successful",
    html: `<h1>Dear ${Name},</h1>
        <p>Your request to reset your Kampe password is successful. Upon your next login
        please use your new password.</p>
        <p><b>Regards,</b></p>
        <p><b>Pebble Signature</b></p>`,
  };

  sgMail
    .send(msg)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      // Log friendly error
      console.error(error);

      if (error.response) {
        // Extract error msg
        const { message, code, response } = error;

        // Extract response msg
        const { headers, body } = response;

        console.error(body);
      }
    });
}

function bookingEmail(Name, Email, ApartmentName, CheckIn, CheckOut, BookingAmount, bookingOrderId) {
  const msg = {
    to: Email, // Change to your recipient
    from: VERIFIED_EMAIL, // Change to your verified sender
    subject: "Booking Confirmation",
    html: `<h1>Dear ${Name},</h1>
        <p>Booking with order number <b>${bookingOrderId}</b> has been <b>Confirmed</b></p>
        <h5> Booking Details</h5>
        <p>Apartment Name: ${ApartmentName}</p>
        <p>Check In Date:${moment(CheckIn)}</p>
        <p>Check Out Date:${moment(CheckOut)}</p>
        <p>Booking Amount:${BookingAmount}</p>`,
  };

  sgMail
    .send(msg)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      // Log friendly error
      console.error(error);

      if (error.response) {
        // Extract error msg
        const { message, code, response } = error;

        // Extract response msg
        const { headers, body } = response;

        console.error(body);
      }
    });
}

async function sendEmailVerificationToken(email) {
  try {
    const verificationCode1 = Math.floor(100000 + Math.random() * 100000);
    await sendEmailToken(email, verificationCode1);
    cacheData(email, verificationCode1);
    return {
      message: `OTP Message sent to ${email} successfully`,
      data: "success",
      status: 200,
      code: verificationCode1,
    };
  } catch (error) {
    logger.error("Error occurred sending token", error);
    return {
      message: `Error occurred sending OTP Message to ${email}`,
      data: error.message,
      status: 500,
    };
  }
}

module.exports = {
  sendEmailVerificationToken,
  passwordEmail,
  SuccessfulPasswordReset,
  registrationSuccessful,
  sendResetPasswordToken,
  bookingEmail,
  verificationCode,
};
