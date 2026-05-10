import type { GitHubRepo } from "../../interfaces/GithubRepo";
import type { Action } from "./actions";

export type State = {
  error: string | null;
  hasMore: boolean;
  loading: boolean;
  page: number;
  repos: GitHubRepo[];
};

export const initialState: State = {
  repos: [],
  page: 1,
  loading: false,
  hasMore: true,
  error: null,
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "fetch_error":
      return {
        ...state,
        error: action.payload,
        hasMore: false,
        loading: false,
      };

    case "fetch_start":
      return { ...state, loading: true };

    case "fetch_success": {
      const existingIds = new Set(state.repos.map((r) => r.id));
      return {
        ...state,
        repos: [
          ...state.repos,
          ...action.payload.items.filter((r) => !existingIds.has(r.id)),
        ],
        hasMore: action.payload.hasMore,
        loading: false,
      };
    }

    case "next_page":
      return { ...state, page: state.page + 1 };

    case "set_error":
      return { ...state, error: action.payload };

    case "reset":
      return initialState;
  }
}
