import type { StarSort } from "../hooks/useInfiniteRepos/actions";

export interface RepoSortFilterProps {
  onSortChange: (sort: StarSort) => void;
  starSort: StarSort;
}
