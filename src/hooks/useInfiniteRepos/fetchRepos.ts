import axios from "axios";
import type { Dispatch } from "react";
import getGithubErrorMessage from "../../utils/githubErrorsResponse";
import type { GitHubRepo } from "../../interfaces/GithubRepo";
import type { FetchReposParams } from "../../interfaces/FetchReposParams";
import type { Action } from "./actions";

const PER_PAGE = 5;

export async function fetchRepos(
  params: FetchReposParams,
  dispatch: Dispatch<Action>,
) {
  const { username, page, starSort, signal } = params;

  dispatch({ type: "fetch_start" });

  try {
    const order = starSort === "asc" ? "asc" : "desc";

    const { data } = await axios.get<{ items: GitHubRepo[] }>(
      `/api/repos/search?q=user:${username}&sort=stars&order=${order}&per_page=${PER_PAGE}&page=${page}`,
      { signal },
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
