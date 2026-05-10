import type { GitHubRepo } from "../../interfaces/GithubRepo";

export type StarSort = "asc" | "desc" | null;

export type Action =
  | { type: "reset" }
  | { type: "fetch_start" }
  | {
      type: "fetch_success";
      payload: fetchSuccessPayload;
    }
  | { type: "fetch_error"; payload: string }
  | { type: "next_page" }
  | { type: "set_error"; payload: string | null };

interface fetchSuccessPayload {
  items: GitHubRepo[];
  hasMore: boolean;
}
