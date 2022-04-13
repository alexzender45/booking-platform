const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { JWT_SECRETE_KEY, TOKEN_DURATION } = require("./config");
const {
  throwError,
  handleCastErrorExceptionForInvalidObjectId,
  isCastError,
} = require("../utils/handleErrors");
const { error } = require("../utils/baseController");
const { USER_TYPE } = require("../utils/constants");

// Generate Authorization Token
async function generateAuthToken(payload) {
  return jwt.sign(payload, JWT_SECRETE_KEY, { expiresIn: TOKEN_DURATION });
}

// checking if a user has a token
const authenticate = async (req, res, next) => {
  try {
    const jwtPayload = decodeJwtToken(req);
    const user = await getUserPayload(jwtPayload);
    req.token = jwtPayload.token;
    req.user = user;
    next();
  } catch (e) {
    return error(res, { code: 401, message: e.message });
  }
};

// Decoding Jwt token
function decodeJwtToken(req) {
  const requestHeaderAuthorization = req.headers.authorization;

  if (!requestHeaderAuthorization) {
    throwError("Authentication Failed. Please login", 401);
  }

  const [authBearer, token] = requestHeaderAuthorization.split(" ");

  if (authBearer !== "Bearer") {
    throwError("Authentication Failed", 401);
  }

  const jwtPayload = verifyToken(token);

  jwtPayload.token = token;
  return jwtPayload;
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRETE_KEY, { expiresIn: TOKEN_DURATION });
}

async function getUserPayload(payload) {
  const userId = payload.userId;
  return getUsersPayload(userId);
}

async function getUsersPayload(userId) {
  return await User.findOne({ _id: userId })
    .orFail(() =>
      throwError("Access denied. Please login or create an account", 401)
    )
    .catch((error) =>
      isCastError(error) ? handleCastErrorExceptionForInvalidObjectId() : error
    );
}

// Permission for users
function permit(roles) {
  return (req, res, next) => {
    const isAuthorized = roles.includes(req.user.role);
    if (!isAuthorized) {
      return error(res, {
        code: 403,
        message: "Unauthorized Access. Contact the admin.",
      });
    }

    next();
  };
}

function isAllowed(users) {
  return (req, res, next) => {
    const isAuthorized = users.includes(req.user.verified);

    if (!isAuthorized) {
      return error(res, {
        code: 403,
        message:
          "You are not a verified user yet. Please contact the Administrator for further directives",
      });
    }

    next();
  };
}

function restrict(users) {
  return (req, res, next) => {
    const isRestricted = users.includes(req.user.isActive);

    if (!isRestricted) {
      return error(res, {
        code: 403,
        message:
          "Sorry You Can Not Perform This Action Your Account is De-activated",
      });
    }

    next();
  };
}

module.exports = {
  authenticate,
  permit,
  generateAuthToken,
  isAllowed,
  restrict,
  verifyToken,
};
