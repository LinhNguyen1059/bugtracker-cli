import { Command } from "commander";
import assignIssueCommand from "./commands/assignIssue.js";
import projectsCommand from "./commands/projects.js";
import setConfigCommand, { clearConfig } from "./config.js";

const program = new Command();

program
  .name("bugtracker")
  .description("Bugtracker automation CLI")
  .version("1.0.0");

program
  .command("assign-issues")
  .description("Bulk assign and update Bugtracker issues")
  .action(assignIssueCommand);

program
  .command("load-projects")
  .description("Fetch and cache Bugtracker projects")
  .action(projectsCommand);

program
  .command("setup")
  .description("Configure Bugtracker API key")
  .action(setConfigCommand);

program
  .command("clear-config")
  .description("Clear all saved configuration")
  .action(clearConfig);

program.parse();
