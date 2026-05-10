import { render, screen, waitFor } from "@testing-library/react";
import { useLocation, MemoryRouter } from "react-router-dom";
import axios from "axios";
import { vi, describe, it, expect, beforeEach } from "vitest";

import User from "../../screens/User";
import { useInfiniteRepos } from "../../hooks/useInfiniteRepos";
import type { GitHubUser } from "../../interfaces/GithubUser";
import type { GitHubRepo } from "../../interfaces/GithubRepo";
import type { StarSort } from "../../hooks/useInfiniteRepos/actions";

const mockNavigate = vi.fn();
const mockSetError = vi.fn();
const mockSetStarSort = vi.fn();

vi.mock("axios", async () => {
  const actual = await vi.importActual<typeof import("axios")>("axios");
  return {
    ...actual,
    default: { ...actual.default, get: vi.fn() },
  };
});

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: vi.fn(),
    useParams: vi.fn(),
    Navigate: ({ to }: { to: string }) => (
      <div data-testid="navigate" data-to={to} />
    ),
  };
});

vi.mock("../../hooks/useInfiniteRepos");

const mockUser: GitHubUser = {
  login: "artartur",
  name: "Artur Souza",
  avatar_url: "https://avatars.githubusercontent.com/u/1",
  bio: "Developer",
  blog: null,
  company: null,
  created_at: "2020-01-01T00:00:00Z",
  email: "",
  followers: 10,
  following: 5,
  location: "Brazil",
  public_repos: 12,
};

const mockRepos: GitHubRepo[] = [
  {
    id: 1,
    name: "repo-alpha",
    description: "First repo",
    stargazers_count: 10,
    language: "TypeScript",
    html_url: "https://github.com/artartur/repo-alpha",
  },
  {
    id: 2,
    name: "repo-beta",
    description: "Second repo",
    stargazers_count: 5,
    language: "JavaScript",
    html_url: "https://github.com/artartur/repo-beta",
  },
];

const defaultHookReturn = {
  repos: [],
  loading: false,
  hasMore: true,
  error: null,
  setError: mockSetError,
  sentinelRef: vi.fn(),
  starSort: "desc" as StarSort,
  setStarSort: mockSetStarSort,
};

const { useParams } = await import("react-router-dom");

const renderUser = () =>
  render(
    <MemoryRouter>
      <User />
    </MemoryRouter>,
  );

describe("User", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLocation).mockReturnValue({
      state: { user: mockUser },
      key: "",
      pathname: "/user/artartur",
      search: "",
      hash: "",
    });

    vi.mocked(useParams).mockReturnValue({ username: "artartur" });

    vi.mocked(useInfiniteRepos).mockReturnValue(defaultHookReturn);
  });

  it("redirects to home when user fetch fails", async () => {
    vi.mocked(useLocation).mockReturnValue({
      state: null,
      key: "",
      pathname: "/user/unknown",
      search: "",
      hash: "",
    });
    vi.mocked(useParams).mockReturnValue({ username: "unknown" });
    vi.mocked(axios.get).mockRejectedValueOnce(new Error("Not found"));

    renderUser();

    await waitFor(() => {
      expect(screen.getByTestId("navigate")).toHaveAttribute("data-to", "/");
    });
  });

  it("renders the user name", () => {
    renderUser();

    expect(
      screen.getByRole("heading", { name: "Artur Souza" }),
    ).toBeInTheDocument();
  });

  it("renders the user login", () => {
    renderUser();

    expect(screen.getByText("@artartur")).toBeInTheDocument();
  });

  it("renders repo cards when repos are loaded", () => {
    vi.mocked(useInfiniteRepos).mockReturnValue({
      ...defaultHookReturn,
      repos: mockRepos,
      hasMore: false,
    });

    renderUser();

    expect(
      screen.getByRole("heading", { name: "repo-alpha" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "repo-beta" }),
    ).toBeInTheDocument();
  });

  it("shows skeletons while loading", () => {
    vi.mocked(useInfiniteRepos).mockReturnValue({
      ...defaultHookReturn,
      loading: true,
    });

    renderUser();

    expect(
      document.querySelectorAll(".placeholder-glow").length,
    ).toBeGreaterThan(0);
  });

  it("shows empty state when user has no repos", () => {
    vi.mocked(useInfiniteRepos).mockReturnValue({
      ...defaultHookReturn,
      repos: [],
      loading: false,
      hasMore: false,
    });

    renderUser();

    expect(
      screen.getByText("Este usuário não possui repositórios públicos."),
    ).toBeInTheDocument();
  });

  it("shows error toast when there is an error", () => {
    vi.mocked(useInfiniteRepos).mockReturnValue({
      ...defaultHookReturn,
      error: "Erro ao carregar repositórios. Tente novamente.",
    });

    renderUser();

    expect(
      screen.getByText("Erro ao carregar repositórios. Tente novamente."),
    ).toBeInTheDocument();
  });
});
