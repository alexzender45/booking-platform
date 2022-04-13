const { connect } = require('mongoose');
const { MONGODB_TEST_URI } = require('../core/config');
const { logger } = require('../utils/logger');
const { throwError } = require('../utils/handleErrors');

module.exports = class Database {
  static async db() {
    try {
      const connection = await connect(MONGODB_TEST_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      });

      if (!connection) {
        throwError('Unable to connect to database', 500);
      }
      logger.info('Database connection successful!');
    } catch (err) {
      logger.error('Database connection failed!');
    }
  }
};
