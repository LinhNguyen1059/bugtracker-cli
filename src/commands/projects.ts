import axios from "axios";
import {
  baseUrl,
  loadConfig,
  setupApiConfig,
  updateConfig,
} from "../config.js";
import { log } from "../util.js";

export async function fetchProjectVersions(projectId: number) {
  let config = await loadConfig();

  if (!config || !config.apiKey) {
    log("error")("API key not found. Please run the setup command first.");
    return [];
  }

  try {
    const response = await axios.get(
      `${baseUrl}/projects/${projectId}/versions.json`,
      { headers: { "X-Redmine-API-Key": config.apiKey } }
    );
    return response.data.versions || [];
  } catch (error: any) {
    console.log(
      "\nWarning: Could not fetch versions.",
      error?.response?.data?.errors || error.message
    );
    return [];
  }
}

export async function fetchProjects() {
  let config = await loadConfig();

  if (!config || !config.apiKey) {
    config = await setupApiConfig();
  }

  // Fetch projects the user can access
  try {
    console.log("\nFetching projects...");
    const response = await axios.get(`${baseUrl}/projects.json`, {
      headers: { "X-Redmine-API-Key": config.apiKey },
    });
    const projects = response.data.projects.map((project: any) => ({
      value: project.id,
      name: project.name,
    }));
    await updateConfig({ projects });
    console.log("\nFetch projects successful.");

    return { ...config, projects };
  } catch (error: any) {
    console.log(
      "\nWarning: Could not fetch projects.",
      error?.response?.data?.errors || error.message
    );
    return config;
  }
}

export default async function projectsCommand() {
  try {
    await fetchProjects();
  } catch (error: any) {
    if (error.name === "ExitPromptError") {
      console.log("\nOperation cancelled by user.");
      process.exit(0);
    }
    throw error;
  }
}
