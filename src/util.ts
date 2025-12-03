import type { Log } from "./type.js";

export const log = (log: Log = "info") => {
  const colors: Record<Log, string> = {
    info: "\x1b[34m", // Blue
    warn: "\x1b[33m", // Yellow
    error: "\x1b[31m", // Red
  };

  return (message: string, ...args: any[]) => {
    const color = colors[log] || colors.info;
    console.log(`${color}[${log.toUpperCase()}] ${message}`, ...args);
  };
};
