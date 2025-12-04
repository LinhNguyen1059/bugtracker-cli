import inquirer from "inquirer";
import { ISSUE_STATUSES, DEFAULTS } from "../constants.js";
import { validateIssueUrls, validateVersion } from "./validators.js";
import { filterByName, moveToTop } from "./helpers.js";
import type {
  Project,
  Member,
  SearchListItem,
  AssignIssueInput,
  AssigneeInput
} from "../types.js";

/**
 * Prompts user for project selection
 */
export async function promptForProject(
  projects: Project[],
  selectedProjectId?: number
): Promise<{ project: number }> {
  const result = await inquirer.prompt([
    {
      type: "search",
      name: "project",
      message: "Project:",
      source: (input: string) => {
        const searchTerm = (input || "").toLowerCase();
        let filtered = filterByName(projects, searchTerm);

        // Move selected project to top if no search term
        if (!searchTerm && selectedProjectId) {
          filtered = moveToTop(filtered, (p) => p.value === selectedProjectId);
        }

        return Promise.resolve(
          filtered.map((p) => ({ name: p.name, value: p.value }))
        );
      }
    }
  ]);

  return result;
}

/**
 * Prompts user for issue URLs, status, and version
 */
export async function promptForIssueDetails(): Promise<AssignIssueInput> {
  return inquirer.prompt([
    {
      type: "input",
      name: "urls",
      message: "Issue URLs (comma-separated):",
      default: DEFAULTS.URL_PLACEHOLDER,
      validate: validateIssueUrls
    },
    {
      type: "search",
      name: "status",
      message: "Status:",
      source: (input: string) => {
        const searchTerm = (input || "").toLowerCase();
        return Promise.resolve(filterByName([...ISSUE_STATUSES], searchTerm));
      }
    },
    {
      type: "input",
      name: "version",
      message: "Target version:",
      default: DEFAULTS.VERSION_PLACEHOLDER,
      validate: validateVersion
    }
  ]);
}

/**
 * Prompts user for assignee selection
 */
export async function promptForAssignee(
  members: Member[],
  selectedAssigneeId?: number
): Promise<AssigneeInput> {
  return inquirer.prompt([
    {
      type: "search",
      name: "assignee",
      message: "Assignee:",
      source: (input: string) => {
        const searchTerm = (input || "").toLowerCase();
        let filtered = filterByName(members, searchTerm);

        // Move selected assignee to top if no search term
        if (!searchTerm && selectedAssigneeId) {
          filtered = moveToTop(filtered, (m) => m.value === selectedAssigneeId);
        }

        return Promise.resolve(
          filtered.map((m) => ({ name: m.name, value: m.value }))
        );
      }
    }
  ]);
}
