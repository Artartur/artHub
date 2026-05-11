import axios from "axios";
import { useState, useEffect } from "react";
import type { GitHubUser } from "../interfaces/GithubUser";
import getGithubErrorMessage from "../utils/githubErrorsResponse";

export function useUser(
  username: string | undefined,
  initialUser?: GitHubUser,
) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!initialUser);
  const [user, setUser] = useState<GitHubUser | null>(initialUser ?? null);

  useEffect(() => {
    if (initialUser || !username) return;

    axios
      .get<GitHubUser>(`/api/users/${username}`)
      .then((res) => setUser(res.data))
      .catch((err) => setError(getGithubErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [username, initialUser]);

  return { user, loading, error };
}
