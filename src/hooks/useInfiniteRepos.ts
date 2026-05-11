import { useReducer, useState, useEffect, useRef, useCallback } from "react";
import { reducer, initialState } from "./useInfiniteRepos/reducer";
import type { StarSort } from "./useInfiniteRepos/actions";
import { fetchRepos } from "./useInfiniteRepos/fetchRepos";

export function useInfiniteRepos(username: string) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [sentinelEl, setSentinelEl] = useState<HTMLDivElement | null>(null);
  const [starSort, setStarSort] = useState<StarSort>("desc");
  const loadingRef = useRef(false);

  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    setSentinelEl(node);
  }, []);

  useEffect(() => {
    dispatch({ type: "reset" });
  }, [username, starSort]);

  useEffect(() => {
    const controller = new AbortController();

    loadingRef.current = true;
    fetchRepos(
      { username, page: state.page, starSort, signal: controller.signal },
      dispatch,
    ).finally(() => {
      if (!controller.signal.aborted) loadingRef.current = false;
    });

    return () => controller.abort();
  }, [username, state.page, starSort]);

  useEffect(() => {
    if (!sentinelEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && state.hasMore && !loadingRef.current) {
          dispatch({ type: "next_page" });
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinelEl);
    return () => observer.disconnect();
  }, [sentinelEl, state.hasMore]);

  const repos = [...state.repos].sort((a, b) =>
    starSort === "asc"
      ? a.stargazers_count - b.stargazers_count
      : b.stargazers_count - a.stargazers_count,
  );

  return {
    repos,
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
