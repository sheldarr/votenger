const formatDate = require('date-fns/format');
const { createLogger, format, transports } = require('winston');
const { cli, combine } = format;

const timestamp = format((info) => {
  info.message = `${formatDate(new Date(), 'HH:mm:ss dd.MM.yyyy')} ${
    info.message
  }`;

  return info;
});

const commonFormat = combine(timestamp(), cli());

const logger = createLogger({
  format: commonFormat,
  transports: [
    new transports.Console({ level: 'info' }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/warn.log', level: 'warn' }),
    new transports.File({ filename: 'logs/info.log', level: 'info' }),
  ],
});

module.exports = logger;
