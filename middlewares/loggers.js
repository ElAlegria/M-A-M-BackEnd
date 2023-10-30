const winston = require('winston');
const expressWinston = require('express-winston');

const errorLoggerApp = expressWinston.logger({
  transports: [new winston.transports.File({ filename: 'error.log' })],
  format: winston.format.json(),
});

const requestLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: 'request.log' })],
  format: winston.format.json(),
});

module.exports = {
  errorLoggerApp,
  requestLogger,
};
