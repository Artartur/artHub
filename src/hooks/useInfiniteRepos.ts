import { useReducer, useState, useEffect, useRef, useMemo } from "react";
import type { GitHubRepo } from "../interfaces/GithubRepo";
import axios from "axios";

import { reducer, initialState } from "./useInfiniteRepos/reducer";
import type { StarSort } from "./useInfiniteRepos/actions";

const API_URL = import.meta.env.VITE_API_URL as string;
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string;
const PER_PAGE = 5;

const headers = GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {};

export function useInfiniteRepos(username: string) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [starSort, setStarSort] = useState<StarSort>("desc");
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    dispatch({ type: "reset" });
  }, [username, starSort]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchRepos = async () => {
      loadingRef.current = true;
      dispatch({ type: "fetch_start" });

      try {
        const order = starSort === "asc" ? "asc" : "desc";

        const { data } = await axios.get<{ items: GitHubRepo[] }>(
          `${API_URL}/search/repositories?q=user:${username}&sort=stars&order=${order}&per_page=${PER_PAGE}&page=${state.page}`,
          { signal: controller.signal, headers },
        );

        dispatch({
          type: "fetch_success",
          payload: {
            items: data.items,
            hasMore: data.items.length === PER_PAGE,
          },
        });
      } catch (err) {
        if (axios.isCancel(err)) return;

        let errorMessage = "Erro ao carregar repositórios. Tente novamente.";

        if (axios.isAxiosError(err)) {
          if (err.response?.status === 429) {
            errorMessage =
              "Limite de requisições atingido. Tente novamente em breve.";
          } else if (err.response?.status === 403) {
            errorMessage = "Acesso negado pela API do GitHub.";
          }
        }

        dispatch({ type: "fetch_error", payload: errorMessage });
      } finally {
        if (!controller.signal.aborted) {
          loadingRef.current = false;
        }
      }
    };

    fetchRepos();
    return () => controller.abort();
  }, [username, state.page, starSort]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && state.hasMore && !loadingRef.current) {
          dispatch({ type: "next_page" });
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [state.hasMore]);

  const sortedRepos = useMemo(
    () =>
      [...state.repos].sort((a, b) =>
        starSort === "asc"
          ? a.stargazers_count - b.stargazers_count
          : b.stargazers_count - a.stargazers_count,
      ),
    [state.repos, starSort],
  );

  return {
    repos: sortedRepos,
    loading: state.loading,
    hasMore: state.hasMore,
    error: state.error,
    setError: (error: string | null) =>
      dispatch({ type: "set_error", payload: error }),
    sentinelRef,
    starSort,
    setStarSort,
  };
}
