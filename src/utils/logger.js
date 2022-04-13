const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console()
  ]
});

logger.configure({
  level: 'verbose',
  transports: [
    new DailyRotateFile({
      dirname: './logs',
      datePattern: 'yyyy-MM-D',
      filename: 'app.log',
      json: false,
      level: 'info',
    }),
    new DailyRotateFile({
      dirname: './logs',
      datePattern: 'yyyy-MM-D',
      filename: 'error.log',
      json: false,
      level: 'error'
    }),
    new winston.transports.Console({
      colorize: true
    })
  ]
});

module.exports = { logger };
