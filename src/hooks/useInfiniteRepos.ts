import { useReducer, useState, useEffect, useRef } from "react";
import { reducer, initialState } from "./useInfiniteRepos/reducer";
import type { StarSort } from "./useInfiniteRepos/actions";
import { fetchRepos } from "./useInfiniteRepos/fetchRepos";

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

  return {
    repos: state.repos,
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
