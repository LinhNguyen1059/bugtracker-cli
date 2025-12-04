export interface Project {
  name: string;
  value: number;
}

export interface Member {
  name: string;
  value: number;
}

export interface Version {
  id: number;
  name: string;
}

export interface Config {
  apiKey?: string;
  projects?: Project[];
  selectedProjectId?: number;
  selectedAssigneeId?: number;
  members?: {
    [projectId: number]: Member[];
  };
}

export type Log = "info" | "warn" | "error";

export interface IssueUpdateFields {
  status_id?: number;
  assigned_to_id?: number;
  fixed_version_id?: number;
}

export interface AssignIssueInput {
  urls: string;
  status: number;
  version: string;
}

export interface AssigneeInput {
  assignee: number;
}

export interface SearchListItem {
  name: string;
  value: number;
}
