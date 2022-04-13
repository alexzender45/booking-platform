const { throwError } = require("./handleErrors");

async function restrictUser(isActive) {
    if (!isActive) {
        throwError("You can not perform this action, your account is deactivated", 401);
    }
}

module.exports = restrictUser;
