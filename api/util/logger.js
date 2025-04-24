// logger.js

const winston = require('winston');

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.simple()
);

const logger = winston.createLogger({
  level: 'info', // Set default logging level
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    }),
    new winston.transports.File({
      filename: 'app.log',
      format: logFormat
    })
  ]
});

module.exports = logger;
