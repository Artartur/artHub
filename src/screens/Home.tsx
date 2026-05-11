import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import Toast from "../components/Toast";
import getGithubErrorMessage from "../utils/githubErrorsResponse";

export default function Home() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  usePageTitle("");

  const reset = () => {
    setError("");
    setQuery("");
  };

  const searchUser = async (formData: FormData) => {
    const query = formData.get("search") as string;

    setLoading(true);

    await axios
      .get(`/api/users/${query}`)
      .then((res) => {
        navigate(`/user/${res.data.login}`, { state: { user: res.data } });
      })
      .catch((e) => {
        setError(getGithubErrorMessage(e));
      })
      .finally(() => setLoading(false));
  };

  return (
    <main className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6">
            <div className="text-center mb-4">
              <h1 className="text-muted">Busque usuários do GitHub</h1>
            </div>
            <form action={searchUser}>
              <div className="input-group input-group-lg shadow-sm">
                <input
                  id="search"
                  name="search"
                  className="form-control border-end-0"
                  placeholder="Digite um usuário..."
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Buscar usuário"
                />
                <button
                  type="submit"
                  className="btn btn-dark px-4"
                  aria-label="Buscar usuário"
                  disabled={!query.trim() || loading}
                >
                  {loading ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-label="Carregando..."
                    />
                  ) : (
                    <i className="bi bi-search" aria-hidden="true" />
                  )}
                </button>
              </div>
            </form>
            {error && <Toast message={error} show={!!error} onClose={reset} />}
          </div>
        </div>
      </div>
    </main>
  );
}
