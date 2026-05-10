import { useState, useEffect, useRef, useMemo } from "react";
import type { GitHubRepo } from "../interfaces/GithubRepo";
import axios from "axios";

const PER_PAGE = 5;

export type StarSort = "asc" | "desc" | null;

export function useInfiniteRepos(username: string) {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [starSort, setStarSort] = useState<StarSort>("desc");
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    setRepos([]);
    setPage(1);
    setHasMore(true);
  }, [username, starSort]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchRepos = async () => {
      loadingRef.current = true;
      setLoading(true);

      try {
        const order = starSort === "asc" ? "asc" : "desc";

        const { data } = await axios.get<{ items: GitHubRepo[] }>(
          `https://api.github.com/search/repositories?q=user:${username}&sort=stars&order=${order}&per_page=${PER_PAGE}&page=${page}`,
          { signal: controller.signal },
        );

        setRepos((prev) => {
          const existingIds = new Set(prev.map((r) => r.id));
          return [...prev, ...data.items.filter((r) => !existingIds.has(r.id))];
        });

        setHasMore(data.items.length === PER_PAGE);
      } catch (err) {
        if ((err as Error).name !== "AbortError") throw err;
      } finally {
        if (!controller.signal.aborted) {
          loadingRef.current = false;
          setLoading(false);
        }
      }
    };

    fetchRepos();
    return () => controller.abort();
  }, [username, page, starSort]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loadingRef.current) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore]);

  const sortedRepos = useMemo(
    () =>
      [...repos].sort((a, b) =>
        starSort === "asc"
          ? a.stargazers_count - b.stargazers_count
          : b.stargazers_count - a.stargazers_count,
      ),
    [repos, starSort],
  );

  return {
    repos: sortedRepos,
    loading,
    hasMore,
    sentinelRef,
    starSort,
    setStarSort,
  };
}
