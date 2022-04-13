
if(process.env.NODE_ENV === "dev") {
  module.exports = require("../config/development")
}

if(process.env.NODE_ENV === "prod") {
  module.exports = require("../config/production")
}

if(process.env.NODE_ENV === "test") {
  module.exports = require("../config/testDB")
}