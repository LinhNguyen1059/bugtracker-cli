import { BugtrackerApiService } from "../services/apiService.js";
import { loadConfig, setupApiConfig, updateConfig } from "../config.js";
import { log, logInfo, logSuccess, logError } from "../utils/logger.js";
import type { Member, Config } from "../types.js";

/**
 * Fetches project members for a given project ID
 * Caches the result in the config file
 */
export async function fetchProjectMembers(
  projectId: number
): Promise<Member[]> {
  const config = await loadConfig();

  if (!config?.apiKey) {
    log("error")("API key not found. Please run the setup command first.");
    return [];
  }

  try {
    logInfo("Fetching project members...");
    const apiService = new BugtrackerApiService(config.apiKey);
    const members = await apiService.fetchProjectMembers(projectId);

    // Cache members in config
    const currentMembers = config.members || {};
    await updateConfig({
      members: {
        ...currentMembers,
        [projectId]: members
      }
    });

    logSuccess("Project members fetched successfully");
    return members;
  } catch (error: any) {
    logError("Failed to fetch project members", error.message);
    return [];
  }
}

/**
 * Fetches project versions for a given project ID
 */
export async function fetchProjectVersions(
  projectId: number
): Promise<Array<{ id: number; name: string }>> {
  const config = await loadConfig();

  if (!config?.apiKey) {
    log("error")("API key not found. Please run the setup command first.");
    return [];
  }

  try {
    const apiService = new BugtrackerApiService(config.apiKey);
    return await apiService.fetchProjectVersions(projectId);
  } catch (error: any) {
    logError("Failed to fetch project versions", error.message);
    return [];
  }
}

/**
 * Fetches all projects accessible to the user
 * Caches the result in the config file
 */
export async function fetchProjects(): Promise<Config> {
  let config = await loadConfig();

  if (!config?.apiKey) {
    config = await setupApiConfig();
  }

  try {
    logInfo("Fetching projects...");
    const apiService = new BugtrackerApiService(config.apiKey!);
    const projectsData = await apiService.fetchProjects();

    const projects = projectsData.map((project) => ({
      value: project.id,
      name: project.name
    }));

    await updateConfig({ projects });
    logSuccess("Projects fetched successfully");

    return { ...config, projects };
  } catch (error: any) {
    logError(
      "Could not fetch projects",
      error?.response?.data?.errors || error.message
    );
    return config;
  }
}

/**
 * Command handler for load-projects command
 */
export default async function projectsCommand(): Promise<void> {
  try {
    await fetchProjects();
  } catch (error: any) {
    if (error.name === "ExitPromptError") {
      logInfo("Operation cancelled by user.");
      process.exit(0);
    }
    throw error;
  }
}
