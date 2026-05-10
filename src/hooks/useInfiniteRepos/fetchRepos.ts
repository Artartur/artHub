import axios from "axios";
import type { Dispatch } from "react";
import getGithubErrorMessage from "../../utils/githubErrorsResponse";
import type { GitHubRepo } from "../../interfaces/GithubRepo";
import type { FetchReposParams } from "../../interfaces/FetchReposParams";
import type { Action } from "./actions";

const API_URL = import.meta.env.VITE_API_URL as string;
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string;
const PER_PAGE = 5;

const headers = GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {};

export async function fetchRepos(
  params: FetchReposParams,
  dispatch: Dispatch<Action>,
) {
  const { username, page, starSort, signal } = params;

  dispatch({ type: "fetch_start" });

  try {
    const order = starSort === "asc" ? "asc" : "desc";

    const { data } = await axios.get<{ items: GitHubRepo[] }>(
      `${API_URL}/search/repositories?q=user:${username}&sort=stars&order=${order}&per_page=${PER_PAGE}&page=${page}`,
      { signal, headers },
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

    dispatch({
      type: "fetch_error",
      payload: getGithubErrorMessage(err as Error),
    });
  }
}
