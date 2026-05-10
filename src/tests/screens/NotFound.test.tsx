import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import NotFound from "../../screens/NotFound";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

const renderNotFound = () =>
  render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>,
  );

describe("NotFound", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the 404 heading", () => {
    renderNotFound();

    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
  });

  it("renders the not found message", () => {
    renderNotFound();

    expect(screen.getByText("Página não encontrada.")).toBeInTheDocument();
  });

  it("renders the back to home button", () => {
    renderNotFound();

    expect(
      screen.getByRole("button", { name: /voltar para a página inicial/i }),
    ).toBeInTheDocument();
  });

  it("navigates to home when button is clicked", async () => {
    renderNotFound();

    await userEvent.click(
      screen.getByRole("button", { name: /voltar para a página inicial/i }),
    );

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
