import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Home from "../../screens/Home";

vi.mock("axios", async () => {
  const actual = await vi.importActual<typeof import("axios")>("axios");

  return {
    ...actual,
    default: { ...actual.default, get: vi.fn() },
  };
});

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

const makeAxiosError = (status: number) =>
  new AxiosError("Error", String(status), undefined, undefined, {
    status,
    data: {},
    headers: {},
    config: {} as InternalAxiosRequestConfig,
    statusText: "",
  });

const renderHome = () =>
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );

const searchAndExpectError = async (
  expectedMessage: string,
  status: number,
  inputSearch?: string,
) => {
  const error = makeAxiosError(status);

  vi.mocked(axios.get).mockRejectedValueOnce(error);

  renderHome();

  await userEvent.type(
    screen.getByRole("searchbox"),
    inputSearch ? inputSearch : "artartur",
  );

  await userEvent.click(
    screen.getByRole("button", { name: /buscar usuário/i }),
  );

  await waitFor(() => {
    expect(screen.getByText(expectedMessage)).toBeInTheDocument();
  });
};

describe("Home", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the search input and button", () => {
    renderHome();

    expect(screen.getByRole("searchbox")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /buscar usuário/i }),
    ).toBeInTheDocument();
  });

  it("disables the button when input is empty", () => {
    renderHome();

    expect(
      screen.getByRole("button", { name: /buscar usuário/i }),
    ).toBeDisabled();
  });

  it("enables the button when input has value", async () => {
    renderHome();

    await userEvent.type(screen.getByRole("searchbox"), "artartur");

    expect(
      screen.getByRole("button", { name: /buscar usuário/i }),
    ).toBeEnabled();
  });

  it("navigates to /user on successful search", async () => {
    const mockUser = { login: "artartur", name: "Artur Souza" };

    vi.mocked(axios.get).mockResolvedValueOnce({ data: mockUser });

    renderHome();

    await userEvent.type(screen.getByRole("searchbox"), "artartur");

    await userEvent.click(
      screen.getByRole("button", { name: /buscar usuário/i }),
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/user/artartur", {
        state: { user: mockUser },
      });
    });
  });

  it("shows error toast when user is not found", async () => {
    searchAndExpectError("Usuário não encontrado.", 404, "smalaskdma");
  });

  it("shows error toast when rate limit is reached", async () => {
    searchAndExpectError(
      "Limite de requisições atingido. Tente novamente em alguns minutos.",
      403,
    );
  });

  it("shows error toast when GitHub service is unavailable", async () => {
    searchAndExpectError(
      "Serviço do GitHub indisponível. Tente novamente mais tarde.",
      503,
    );
  });
});
