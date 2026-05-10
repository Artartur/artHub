import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useLocation, MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";

import Repo from "../../screens/Repo";
import type { GitHubRepo } from "../../interfaces/GithubRepo";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: vi.fn(),
    Navigate: ({ to }: { to: string }) => (
      <div data-testid="navigate" data-to={to} />
    ),
  };
});

const mockRepo: GitHubRepo = {
  id: 1,
  name: "repo-alpha",
  description: "A test repository",
  stargazers_count: 42,
  language: "TypeScript",
  html_url: "https://github.com/artartur/repo-alpha",
};

const renderRepo = () =>
  render(
    <MemoryRouter>
      <Repo />
    </MemoryRouter>,
  );

describe("Repo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLocation).mockReturnValue({
      state: { repo: mockRepo },
      key: "",
      pathname: "/repo",
      search: "",
      hash: "",
    });
  });

  it("redirects to home when repo state is missing", () => {
    vi.mocked(useLocation).mockReturnValue({
      state: null,
      key: "",
      pathname: "/repo",
      search: "",
      hash: "",
    });

    renderRepo();

    expect(screen.getByTestId("navigate")).toHaveAttribute("data-to", "/");
  });

  it("renders the repo name", () => {
    renderRepo();

    expect(
      screen.getByRole("heading", { name: "repo-alpha" }),
    ).toBeInTheDocument();
  });

  it("renders the repo description", () => {
    renderRepo();

    expect(screen.getByText("A test repository")).toBeInTheDocument();
  });

  it("renders the star count", () => {
    renderRepo();

    expect(screen.getByText(/42 estrelas/i)).toBeInTheDocument();
  });

  it("renders singular estrela when count is 1", () => {
    vi.mocked(useLocation).mockReturnValue({
      state: { repo: { ...mockRepo, stargazers_count: 1 } },
      key: "",
      pathname: "/repo",
      search: "",
      hash: "",
    });

    renderRepo();

    expect(screen.getByText(/1 estrela$/i)).toBeInTheDocument();
  });

  it("renders the language", () => {
    renderRepo();

    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("does not render description when it is null", () => {
    vi.mocked(useLocation).mockReturnValue({
      state: { repo: { ...mockRepo, description: null } },
      key: "",
      pathname: "/repo",
      search: "",
      hash: "",
    });

    renderRepo();

    expect(screen.queryByText("A test repository")).not.toBeInTheDocument();
  });

  it("does not render language when it is null", () => {
    vi.mocked(useLocation).mockReturnValue({
      state: { repo: { ...mockRepo, language: null } },
      key: "",
      pathname: "/repo",
      search: "",
      hash: "",
    });

    renderRepo();

    expect(screen.queryByText("TypeScript")).not.toBeInTheDocument();
  });

  it("renders the GitHub link with correct href", () => {
    renderRepo();

    expect(
      screen.getByRole("link", { name: /ver repo-alpha no github/i }),
    ).toHaveAttribute("href", "https://github.com/artartur/repo-alpha");
  });

  it("navigates back when back button is clicked", async () => {
    renderRepo();

    await userEvent.click(
      screen.getByRole("button", {
        name: /voltar para a listagem de repositórios/i,
      }),
    );

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
