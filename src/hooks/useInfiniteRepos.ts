import { useEffect, useRef, useState } from "react";
import axios from "axios";
import type { GitHubRepo } from "../interfaces/GithubRepo";

export function useInfiniteRepos(login: string, direction: "asc" | "desc") {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const prevDirectionRef = useRef(direction);

  useEffect(() => {
    if (prevDirectionRef.current !== direction) {
      prevDirectionRef.current = direction;
      hasMoreRef.current = true;
      setHasMore(true);
      setRepos([]);
      setPage(1);
      return;
    }

    if (!hasMoreRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    axios
      .get(`${import.meta.env.VITE_API_URL}/users/${login}/repos`, {
        params: { per_page: 5, page, sort: "stars", direction },
      })
      .then((res) => {
        setRepos((prev) => [...prev, ...res.data]);
        if (res.data.length < 5) {
          hasMoreRef.current = false;
          setHasMore(false);
        }
      })
      .finally(() => {
        setLoading(false);
        loadingRef.current = false;
      });
  }, [page, login, direction]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current && hasMoreRef.current) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return { repos, loading, hasMore, sentinelRef };
}
