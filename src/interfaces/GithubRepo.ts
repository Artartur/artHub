export interface GitHubRepo {
  id: number;
  description: string | null;
  html_url: string;
  language: string | null;
  name: string;
  stargazers_count: number;
}
