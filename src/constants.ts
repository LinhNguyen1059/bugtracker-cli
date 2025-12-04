import path from "path";

/**
 * API Configuration
 */
export const BASE_URL = "https://bugtracker.i3international.com";

/**
 * File System Paths
 */
export const CONFIG_DIR = path.join(process.env.HOME || "", ".bugtracker");
export const CONFIG_FILE_PATH = path.join(CONFIG_DIR, "config.json");

/**
 * Issue Statuses
 */
export const ISSUE_STATUSES = [
  { name: "Waiting", value: 1 },
  { name: "Confirmed", value: 8 },
  { name: "In Progress", value: 2 },
  { name: "Resolved", value: 3 },
  { name: "Feedback", value: 4 },
  { name: "Reopened", value: 10 },
  { name: "Rejected", value: 6 },
  { name: "Closed", value: 5 },
  { name: "Pended", value: 7 }
] as const;

/**
 * Default Values
 */
export const DEFAULTS = {
  VERSION_PLACEHOLDER: "e.g., 1.0.0",
  URL_PLACEHOLDER: "e.g., https://bugtracker.i3international.com/issues/12345"
} as const;

/**
 * Regular Expressions
 */
export const ISSUE_URL_PATTERN = /\/issues\/(\d+)/;

/**
 * API Limits
 */
export const API_LIMITS = {
  MEMBERSHIPS_PER_PAGE: 100
} as const;
