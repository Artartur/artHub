import type { StarSort } from "../hooks/useInfiniteRepos";

export interface RepoSortFilterProps {
  onSortChange: (sort: StarSort) => void;
  starSort: StarSort;
}
