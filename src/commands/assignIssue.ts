import inquirer from "inquirer";
import axios from "axios";
import { fetchProjects, fetchProjectVersions } from "./projects.js";
import { baseUrl, loadConfig, updateConfig } from "../config.js";
import { log } from "../util.js";

async function loadProjects() {
  let config = await loadConfig();

  if (!config || !config.projects) {
    config = await fetchProjects();
  }

  return config;
}

async function updateIssue(apiKey: string, id: number, fields: any) {
  return axios.put(
    `${baseUrl}/issues/${id}.json`,
    { issue: fields },
    { headers: { "X-Redmine-API-Key": apiKey } }
  );
}

export default async function assignIssueCommand() {
  try {
    const config = await loadProjects();

    if (!config || !config.apiKey) {
      log("error")("API key not found. Please run the setup command first.");
      return;
    }

    let selectedProject;
    if (config?.selectedProjectId && config?.projects) {
      selectedProject = config.projects.find(
        (p) => p.value === config.selectedProjectId
      );
    }

    let selectedAssignee;
    if (config?.selectedAssigneeId) {
      selectedAssignee = config.selectedAssigneeId;
    }

    const input = await inquirer.prompt([
      {
        type: "search",
        name: "project",
        message: "Project:",
        source: (input: string) => {
          const projects = config?.projects || [];
          const searchTerm = (input || "").toLowerCase();

          let filteredProjects = projects
            .filter((project) =>
              project.name.toLowerCase().includes(searchTerm)
            )
            .map((p) => ({ name: p.name, value: p.value }));

          // Move selected project to the top if no search term
          if (!searchTerm && config?.selectedProjectId) {
            const selectedIndex = filteredProjects.findIndex(
              (p) => p.value === config.selectedProjectId
            );
            if (selectedIndex > 0) {
              filteredProjects.splice(selectedIndex, 1);
              filteredProjects.unshift(selectedProject!);
            }
          }

          return Promise.resolve(filteredProjects);
        },
      },
      {
        type: "input",
        name: "urls",
        message: "Issue URLs (comma-separated):",
        default: "e.g., https://bugtracker.i3international.com/issues/12345",
        validate: (input) => {
          if (!input || input.trim() === "" || input.startsWith("e.g.,")) {
            return "Please enter valid issue URLs";
          }
          return true;
        },
      },
      {
        type: "search",
        name: "status",
        message: "Status:",
        source: (input: string) => {
          const statuses = [
            { name: "Waiting", value: 1 },
            { name: "Confirmed", value: 8 },
            { name: "In Progress", value: 2 },
            { name: "Resolved", value: 3 },
            { name: "Feedback", value: 4 },
            { name: "Reopened", value: 10 },
            { name: "Rejected", value: 6 },
            { name: "Closed", value: 5 },
            { name: "Pended", value: 7 },
          ];
          const searchTerm = (input || "").toLowerCase();
          return Promise.resolve(
            statuses.filter((status) =>
              status.name.toLowerCase().includes(searchTerm)
            )
          );
        },
      },
      {
        type: "input",
        name: "assignee",
        message: "Assignee ID:",
        default: selectedAssignee ? selectedAssignee.toString() : "e.g., 5",
        validate: (input) => {
          if (input && input.startsWith("e.g.,")) {
            return "Please enter a valid assignee ID";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "version",
        message: "Target version:",
        default: "e.g., 1.0.0",
        validate: (input) => {
          if (input && input.startsWith("e.g.,")) {
            return "Please enter a valid version ID";
          }
          return true;
        },
      },
    ]);

    if (input.project) {
      await updateConfig({ selectedProjectId: input.project });
    }

    if (input.assignee) {
      await updateConfig({ selectedAssigneeId: parseInt(input.assignee) });
    }

    if (input.version) {
      console.log("Fetching project's versions...");
      const versions = await fetchProjectVersions(input.project);
      const matchedVersion = versions.find(
        (v: any) => v.name === input.version
      );
      if (matchedVersion) {
        input.version = matchedVersion.id;
      } else {
        log("error")(`Version "${input.version}" not found in project.`);
        process.exit(0);
      }
    }

    // Parse URLs to extract issue IDs
    const ids = input.urls
      .split(",")
      .map((url: string) => {
        const trimmed = url.trim();
        // Extract ID from URL pattern: /issues/12345
        const match = trimmed.match(/\/issues\/(\d+)/);
        if (match && match[1]) {
          return parseInt(match[1]);
        }
        // If it's just a number, parse it directly
        const num = parseInt(trimmed);
        return isNaN(num) ? null : num;
      })
      .filter((id: number | null) => id !== null);

    if (ids.length === 0) {
      log("error")("No valid issue IDs found in the provided URLs.");
      process.exit(0);
    }

    const payload: any = {};

    if (input.status) payload.status_id = input.status;
    if (input.assignee) payload.assigned_to_id = parseInt(input.assignee);
    if (input.version) payload.fixed_version_id = input.version;

    for (const id of ids) {
      try {
        console.log(`Updating issue #${id}...`);
        await updateIssue(config.apiKey, id, payload);
        console.log(`✔ Updated #${id}`);
      } catch (err: any) {
        console.log(`✖ Error updating #${id}`, err?.response?.data);
      }
    }
  } catch (error: any) {
    if (error.name === "ExitPromptError") {
      log("info")("Operation cancelled by user.");
      process.exit(0);
    }
    throw error;
  }
}
