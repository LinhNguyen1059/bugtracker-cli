import inquirer from "inquirer";
import fs from "fs-extra";
import { CONFIG_DIR, CONFIG_FILE_PATH } from "./constants.js";
import { validateApiKey } from "./utils/validators.js";
import { logSuccess } from "./utils/logger.js";
import type { Config } from "./types.js";

/**
 * Loads the configuration from disk
 */
export async function loadConfig(): Promise<Config | null> {
  if (fs.existsSync(CONFIG_FILE_PATH)) {
    return fs.readJson(CONFIG_FILE_PATH);
  }
  return null;
}

/**
 * Saves the API token to the configuration file
 */
export async function saveApiToken(apiKey: string): Promise<void> {
  await fs.ensureDir(CONFIG_DIR);
  await fs.writeJson(CONFIG_FILE_PATH, { apiKey });
}

/**
 * Updates the configuration with new fields
 */
export async function updateConfig(fields: Partial<Config>): Promise<void> {
  const config = (await loadConfig()) || {};
  const updatedConfig = { ...config, ...fields };
  await fs.ensureDir(CONFIG_DIR);
  await fs.writeJson(CONFIG_FILE_PATH, updatedConfig);
}

/**
 * Prompts user for API key and saves it
 */
export async function setupApiConfig(): Promise<Config> {
  const setup = await inquirer.prompt([
    {
      type: "password",
      name: "apiKey",
      message: "Bugtracker API key:",
      placeholder: "Enter your Bugtracker API key",
      validate: validateApiKey
    }
  ]);

  await saveApiToken(setup.apiKey);
  logSuccess("API key saved successfully");

  return setup;
}

/**
 * Clears the configuration file
 */
export async function clearConfig(): Promise<void> {
  if (fs.existsSync(CONFIG_FILE_PATH)) {
    await fs.remove(CONFIG_FILE_PATH);
    logSuccess("Configuration cleared successfully");
  }
}

/**
 * Command handler for setup command
 */
export default async function setConfigCommand(): Promise<void> {
  await setupApiConfig();
}
