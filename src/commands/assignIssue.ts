import { BugtrackerApiService } from "../services/apiService.js";
import {
  fetchProjects,
  fetchProjectVersions,
  fetchProjectMembers
} from "./projects.js";
import { loadConfig, updateConfig } from "../config.js";
import { log, logSuccess, logError, logInfo } from "../utils/logger.js";
import { parseIssueIds } from "../utils/helpers.js";
import {
  promptForProject,
  promptForIssueDetails,
  promptForAssignee
} from "../utils/prompts.js";
import type { Member, Config, IssueUpdateFields } from "../types.js";

/**
 * Loads projects from config or fetches them if not cached
 */
async function loadProjects(): Promise<Config> {
  let config = await loadConfig();

  if (!config?.projects) {
    config = await fetchProjects();
  }

  return config;
}

/**
 * Loads members for a project from config or fetches them if not cached
 */
async function loadProjectMembers(
  projectId: number,
  config: Config
): Promise<Member[]> {
  const cachedMembers = config.members?.[projectId];

  if (cachedMembers && cachedMembers.length > 0) {
    return cachedMembers;
  }

  return await fetchProjectMembers(projectId);
}

/**
 * Resolves version name to version ID
 */
async function resolveVersionId(
  projectId: number,
  versionName: string
): Promise<number | null> {
  if (!versionName) return null;

  logInfo("Fetching project versions...");
  const versions = await fetchProjectVersions(projectId);
  const matchedVersion = versions.find((v) => v.name === versionName);

  if (!matchedVersion) {
    log("error")(`Version "${versionName}" not found in project.`);
    return null;
  }

  return matchedVersion.id;
}

/**
 * Updates multiple issues with the same fields
 */
async function bulkUpdateIssues(
  apiService: BugtrackerApiService,
  issueIds: number[],
  fields: IssueUpdateFields
): Promise<void> {
  for (const id of issueIds) {
    try {
      logInfo(`Updating issue #${id}...`);
      await apiService.updateIssue(id, fields);
      logSuccess(`Issue #${id} updated`);
    } catch (err: any) {
      logError(`Error updating issue #${id}`, err?.response?.data);
    }
  }
}

/**
 * Main command handler for assign-issues
 */
export default async function assignIssueCommand(): Promise<void> {
  try {
    const config = await loadProjects();

    if (!config?.apiKey) {
      log("error")("API key not found. Please run the setup command first.");
      return;
    }

    if (!config.projects || config.projects.length === 0) {
      log("error")("No projects found. Please run load-projects first.");
      return;
    }

    // Prompt for project
    const { project: projectId } = await promptForProject(
      config.projects,
      config.selectedProjectId
    );

    // Prompt for issue details
    const issueDetails = await promptForIssueDetails();

    // Load members for selected project
    const members = await loadProjectMembers(projectId, config);

    // Prompt for assignee
    const { assignee: assigneeId } = await promptForAssignee(
      members,
      config.selectedAssigneeId
    );

    // Save user preferences
    await updateConfig({
      selectedProjectId: projectId,
      selectedAssigneeId: assigneeId
    });

    // Resolve version ID if provided
    let versionId: number | null = null;
    if (issueDetails.version) {
      versionId = await resolveVersionId(projectId, issueDetails.version);
      if (versionId === null) {
        process.exit(0);
      }
    }

    // Parse issue IDs from URLs
    const issueIds = parseIssueIds(issueDetails.urls);

    if (issueIds.length === 0) {
      log("error")("No valid issue IDs found in the provided URLs.");
      process.exit(0);
    }

    // Build update payload
    const updateFields: IssueUpdateFields = {};
    if (issueDetails.status) updateFields.status_id = issueDetails.status;
    if (assigneeId) updateFields.assigned_to_id = assigneeId;
    if (versionId) updateFields.fixed_version_id = versionId;

    // Update all issues
    const apiService = new BugtrackerApiService(config.apiKey);
    await bulkUpdateIssues(apiService, issueIds, updateFields);
  } catch (error: any) {
    if (error.name === "ExitPromptError") {
      logInfo("Operation cancelled by user.");
      process.exit(0);
    }
    throw error;
  }
}
