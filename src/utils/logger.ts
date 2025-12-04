import type { Log } from "../types.js";

/**
 * Console color codes for different log levels
 */
const LOG_COLORS: Record<Log, string> = {
  info: "\x1b[34m", // Blue
  warn: "\x1b[33m", // Yellow
  error: "\x1b[31m" // Red
};

const RESET_COLOR = "\x1b[0m";

/**
 * Creates a logger function for the specified log level
 * @param level - The log level (info, warn, error)
 * @returns A function that logs messages with the appropriate color
 */
export const log = (level: Log = "info") => {
  const color = LOG_COLORS[level] || LOG_COLORS.info;

  return (message: string, ...args: any[]) => {
    console.log(
      `${color}[${level.toUpperCase()}] ${message}${RESET_COLOR}`,
      ...args
    );
  };
};

/**
 * Logs a success message
 */
export const logSuccess = (message: string) => {
  console.log(`\x1b[32m✔ ${message}\x1b[0m`);
};

/**
 * Logs an error message
 */
export const logError = (message: string, details?: any) => {
  console.log(`\x1b[31m✖ ${message}\x1b[0m`, details || "");
};

/**
 * Logs an info message
 */
export const logInfo = (message: string) => {
  console.log(`\x1b[36mℹ ${message}\x1b[0m`);
};
