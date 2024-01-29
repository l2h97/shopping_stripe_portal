/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConsoleLogger, Injectable } from "@nestjs/common";
import { Logger, createLogger, format, transports } from "winston";
import { ConfigurationService } from "../../config/configuration.service";

@Injectable()
export class LoggerService extends ConsoleLogger {
  private logger: Logger;

  constructor(private configurationService: ConfigurationService) {
    super();
    const { combine, timestamp, printf, colorize } = format;
    this.logger = createLogger({
      format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        printf(
          ({ level, timestamp, message, correlationId = "", ...metadata }) => {
            const data =
              metadata[Symbol.for("splat")][0]
                .map((item: any) => JSON.stringify(item, null, 2))
                .join("\n") || "";

            if (!correlationId) {
              return `[${timestamp}] [${level.toUpperCase()}] ${message} ${data}`;
            }

            return `[${timestamp}] [${level.toUpperCase()}] [${correlationId}] ${message} ${data}`;
          },
        ),
      ),
      transports:
        this.configurationService.nodeEnv === "development"
          ? [
              new transports.Console({
                level: "debug",
                format: colorize({ all: true }),
              }),
              new transports.File({
                filename: "public/logs/rtc_logs.log",
                level: "debug",
              }),
            ]
          : [
              new transports.Console({
                level: "debug",
                format: colorize({ all: true }),
              }),
            ],
    });
  }

  set setCorrelationId(correlationId: string) {
    this.logger.defaultMeta = {
      ...this.logger.defaultMeta,
      correlationId,
    };
  }

  get getCorrelationId(): string {
    return this.logger.defaultMeta.correlationId;
  }

  log(message: string, ...meta: any[]) {
    this.logger.info(message, meta);
  }

  warn(message: string, ...meta: any[]) {
    this.logger.warn(message, meta);
  }

  error(message: string, ...meta: any[]) {
    this.logger.error(message, meta);
  }

  debug(message: string, ...meta: any[]) {
    this.logger.debug(message, meta);
  }
}
