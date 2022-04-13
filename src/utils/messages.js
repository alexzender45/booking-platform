const { FRONT_END_BASE_URL } = require("../core/config");

exports.resetPasswordMessage = (token) => {
    return `
        <h2>Please click the link below to reset your password</h2>                
        <p>${FRONT_END_BASE_URL}/resetPassword/${token}</p>
    `
}

exports.adminAccountCreationMessage = (token) => {
    return `
        <h2>Please click the link below to reset your password.</h2>                
        <h2>You need to reset your password to access your newly created admin account.</h2>                
        <p>${FRONT_END_BASE_URL}/resetPassword/${token}</p>
    `
}
