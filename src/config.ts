import inquirer from "inquirer";
import fs from "fs-extra";
import path from "path";
import type { Config } from "./type.js";

export const baseUrl = "https://bugtracker.i3international.com";

const configPath = path.join(
  process.env.HOME || "",
  ".bugtracker",
  "config.json"
);

export async function loadConfig(): Promise<Config | null> {
  if (fs.existsSync(configPath)) return fs.readJson(configPath);
  return null;
}

export async function saveApiToken(apiKey: string) {
  await fs.ensureDir(path.dirname(configPath));
  await fs.writeJson(configPath, { apiKey });
}

export async function updateConfig(fields: any) {
  const config = (await loadConfig()) || {};
  const updatedConfig = { ...config, ...fields };
  await fs.ensureDir(path.dirname(configPath));
  await fs.writeJson(configPath, updatedConfig);
}

export async function setupApiConfig() {
  const setup = await inquirer.prompt([
    {
      type: "password",
      name: "apiKey",
      message: "Bugtracker API key:",
      placeholder: "Enter your Bugtracker API key",
      validate: (input) => {
        if (!input || input.trim() === "") {
          return "API key is required";
        }
        return true;
      },
    },
  ]);
  await saveApiToken(setup.apiKey);

  return setup;
}

export async function clearConfig() {
  if (fs.existsSync(configPath)) {
    await fs.remove(configPath);
  }
}

export default async function setConfigCommand() {
  await setupApiConfig();
}
