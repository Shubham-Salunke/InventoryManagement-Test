/**
 * Production logger utility
 * Provides structured logging for debugging and monitoring
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

class Logger {
  constructor(
    namespace = "App",
    minLevel = LOG_LEVELS.INFO
  ) {
    this.namespace = namespace;
    this.minLevel = minLevel;

    // Development mode: show all logs
    if (process.env.NODE_ENV === "development") {
      this.minLevel = LOG_LEVELS.DEBUG;
    }
  }

  /**
   * Format log message with timestamp and namespace
   */
  _format(level, message, data) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${this.namespace}] [${level}]`;

    return {
      timestamp,
      namespace: this.namespace,
      level,
      message,
      data,
      prefix,
    };
  }

  /**
   * Send logs to monitoring service (Sentry, LogRocket, etc.)
   * Replace this with your monitoring service
   */
  _sendToMonitoring(level, message, data) {
    // Example: Send to Sentry in production
    if (
      process.env.NODE_ENV === "production" &&
      window.Sentry
    ) {
      const captureLevel =
        {
          ERROR: "error",
          WARN: "warning",
          INFO: "info",
          DEBUG: "debug",
        }[level] || "info";

      window.Sentry.captureMessage(message, {
        level: captureLevel,
        tags: { namespace: this.namespace },
        extra: data,
      });
    }
  }

  debug(message, data = {}) {
    if (this.minLevel <= LOG_LEVELS.DEBUG) {
      const formatted = this._format(
        "DEBUG",
        message,
        data
      );
      console.debug(formatted.prefix, message, data);
    }
  }

  info(message, data = {}) {
    if (this.minLevel <= LOG_LEVELS.INFO) {
      const formatted = this._format(
        "INFO",
        message,
        data
      );
      console.info(formatted.prefix, message, data);
    }
  }

  warn(message, data = {}) {
    if (this.minLevel <= LOG_LEVELS.WARN) {
      const formatted = this._format(
        "WARN",
        message,
        data
      );
      console.warn(formatted.prefix, message, data);
    }
  }

  error(message, error = {}) {
    const formatted = this._format(
      "ERROR",
      message,
      error
    );
    console.error(formatted.prefix, message, error);

    // Send to monitoring service
    this._sendToMonitoring("ERROR", message, error);
  }
}

// Create default logger instance
const logger = new Logger("Category");

export default logger;

// Export class for custom loggers
export { Logger };