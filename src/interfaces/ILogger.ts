export interface ILoggerInput {
  operation: string;
  message: string;
  data?: any;
}

export interface ILogger {
  init(name: string): void;
  error(args: ILoggerInput): void;
  warn(args: ILoggerInput): void;
  info(args: ILoggerInput): void;
  verbose(args: ILoggerInput): void;
  debug(args: ILoggerInput): void;
  silly(args: ILoggerInput): void;
}
