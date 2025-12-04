import axios, { type AxiosInstance } from "axios";
import { BASE_URL, API_LIMITS } from "../constants.js";
import type { Member } from "../types.js";

/**
 * API Service for Bugtracker
 * Handles all HTTP requests to the Bugtracker API
 */
export class BugtrackerApiService {
  private client: AxiosInstance;

  constructor(apiKey: string) {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        "X-Redmine-API-Key": apiKey
      }
    });
  }

  /**
   * Fetch all projects accessible to the user
   */
  async fetchProjects(): Promise<Array<{ id: number; name: string }>> {
    const response = await this.client.get("/projects.json");
    return response.data.projects || [];
  }

  /**
   * Fetch all versions for a specific project
   */
  async fetchProjectVersions(
    projectId: number
  ): Promise<Array<{ id: number; name: string }>> {
    const response = await this.client.get(
      `/projects/${projectId}/versions.json`
    );
    return response.data.versions || [];
  }

  /**
   * Fetch all members (users and groups) for a specific project
   */
  async fetchProjectMembers(projectId: number): Promise<Member[]> {
    const response = await this.client.get(
      `/projects/${projectId}/memberships.json`,
      {
        params: { limit: API_LIMITS.MEMBERSHIPS_PER_PAGE }
      }
    );

    const memberships = response.data.memberships || [];
    return memberships.map((membership: any) => {
      const member = membership.user || membership.group;
      return {
        value: member.id,
        name: member.name
      };
    });
  }

  /**
   * Update an issue with the provided fields
   */
  async updateIssue(
    issueId: number,
    fields: {
      status_id?: number;
      assigned_to_id?: number;
      fixed_version_id?: number;
    }
  ): Promise<void> {
    await this.client.put(`/issues/${issueId}.json`, { issue: fields });
  }
}
