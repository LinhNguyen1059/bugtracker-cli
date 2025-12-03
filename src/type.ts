export interface Project {
  name: string;
  value: number;
}

export interface Config {
  apiKey?: string;
  projects?: Project[];
  selectedProjectId?: number;
  selectedAssigneeId?: number;
}

export type Log = "info" | "warn" | "error";
