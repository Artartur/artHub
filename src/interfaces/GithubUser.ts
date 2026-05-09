export interface GitHubUser {
  avatar_url: string;
  bio: string | null;
  blog: string | null;
  company: string | null;
  created_at: string;
  email: string;
  followers: number;
  following: number;
  location: string | null;
  login: string;
  name: string;
  public_repos: number;
}
