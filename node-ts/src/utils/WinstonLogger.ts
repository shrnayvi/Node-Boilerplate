import winston, { format, Logger, LoggerOptions } from 'winston';
import { injectable } from 'inversify';
import colors from 'colors';
import util from 'util';
import isError from 'lodash/isError';
import 'winston-daily-rotate-file';

import { ILogger, ILoggerInput } from '../interfaces/ILogger';
import config from '../config';

const { combine, timestamp, label, printf } = format;

interface ILogEntry extends ILoggerInput {
  level: string;
}

const rotateFileOptions = {
  level: config.log.fileLogLevel,
  dirname: config.log.dirname,
  filename: `.${config.appName}-%DATE%.log`,
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
};

@injectable()
export default class WinstonLogger implements ILogger {
  private logger: Logger;
  private name: string;

  constructor() {
    let loggerOptions: LoggerOptions = this.getOptions();
    this.logger = winston.createLogger(loggerOptions);
  }

  init(name: string) {
    this.name = name;
  }

  log(args: ILogEntry) {
    let logArgs = {
      ...args,
      name: `${this.name || ''}.${args.operation}()`,
    };

    if (isError(args.data)) {
      logArgs.data = args.data.stack;
    }

    this.logger.log(logArgs);
  }

  error(args: ILoggerInput): void {
    this.log({
      level: 'error',
      ...args,
    });
  }

  warn(args: ILoggerInput): void {
    this.log({
      level: 'warn',
      ...args,
    });
  }

  info(args: ILoggerInput): void {
    this.log({
      level: 'info',
      ...args,
    });
  }

  verbose(args: ILoggerInput): void {
    this.log({
      level: 'verbose',
      ...args,
    });
  }

  debug(args: ILoggerInput): void {
    this.log({
      level: 'debug',
      ...args,
    });
  }

  silly(args: ILoggerInput): void {
    this.log({
      level: 'silly',
      ...args,
    });
  }

  consoleFormatter() {
    let formatter = printf(
      (info) =>
        `${colors.grey(info.timestamp)} - ${info.name ? `${colors.magenta(info.name)} - ` : ''}${info.level}: ${
          info.message
        } ${info.data ? `\n${colors.magenta(util.format('%o', info.data))}` : ''}`
    );

    return combine(label({ label: 'label' }), timestamp(), formatter);
  }

  fileFormatter() {
    let formatter = printf(
      (info) =>
        `${info.timestamp} - ${info.name ? `${info.name} - ` : ''}${info.level}: ${info.message} ${
          info.data ? `\n data: ${util.format('%o', info.data)}` : ''
        }
      `
    );

    return combine(label({ label: 'label' }), timestamp(), formatter);
  }

  getOptions = (): LoggerOptions => {
    let options: LoggerOptions = {};
    if (config.env !== 'production') {
      options.level = 'debug';
      options.transports = [new winston.transports.Console()];
      options.format = this.consoleFormatter();
    } else {
      options.level = 'info';
      options.transports = [
        new winston.transports.DailyRotateFile({
          ...rotateFileOptions,
          level: config.log.logLevels.error,
          filename: `.${config.log.errorLogFilename}-%DATE%.log`,
        }),
        new winston.transports.DailyRotateFile(rotateFileOptions),
      ];
      options.format = this.fileFormatter();
    }

    return options;
  };
}
