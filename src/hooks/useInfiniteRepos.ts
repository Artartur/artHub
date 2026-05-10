import { useState, useEffect, useRef, useMemo } from "react";
import type { GitHubRepo } from "../interfaces/GithubRepo";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL as string;
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string;
const PER_PAGE = 5;

const headers = GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {};

export type StarSort = "asc" | "desc" | null;

export function useInfiniteRepos(username: string) {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [starSort, setStarSort] = useState<StarSort>("desc");
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    setRepos([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [username, starSort]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchRepos = async () => {
      loadingRef.current = true;
      setLoading(true);

      try {
        const order = starSort === "asc" ? "asc" : "desc";

        const { data } = await axios.get<{ items: GitHubRepo[] }>(
          `${API_URL}/search/repositories?q=user:${username}&sort=stars&order=${order}&per_page=${PER_PAGE}&page=${page}`,
          { signal: controller.signal, headers },
        );

        setRepos((prev) => {
          const existingIds = new Set(prev.map((r) => r.id));
          return [...prev, ...data.items.filter((r) => !existingIds.has(r.id))];
        });

        setHasMore(data.items.length === PER_PAGE);
      } catch (err) {
        if (axios.isCancel(err)) return;

        if (axios.isAxiosError(err)) {
          if (err.response?.status === 429) {
            setError(
              "Limite de requisições atingido. Tente novamente em breve.",
            );
          } else if (err.response?.status === 403) {
            setError("Acesso negado pela API do GitHub.");
          } else {
            setError("Erro ao carregar repositórios. Tente novamente.");
          }
        }

        setHasMore(false);
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
    error,
    setError,
    sentinelRef,
    starSort,
    setStarSort,
  };
}
