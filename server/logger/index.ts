import winston from 'winston';

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.logstash(),
);

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.cli()),
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: fileFormat,
    }),
    new winston.transports.File({
      filename: 'logs/warn.log',
      format: fileFormat,
      level: 'warn',
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      format: fileFormat,
      level: 'error',
    }),
  ],
});

export default logger;
