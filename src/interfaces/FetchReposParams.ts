import type { StarSort } from "../hooks/useInfiniteRepos/actions";

export interface FetchReposParams {
  page: number;
  signal: AbortSignal;
  starSort: StarSort;
  username: string;
}
