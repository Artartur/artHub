import axios from "axios";
import { useState } from "react";
import Toast from "../components/Toast";
import getGithubErrorMessage from "../utils/githubErrorsReponse";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const reset = () => {
    setError("");
    setQuery("");
  };

  const searchUser = (formData: FormData) => {
    const query = formData.get("search") as string;

    setLoading(true);

    axios
      .get(`${import.meta.env.VITE_API_URL}/users/${query}`)
      .then((res) => {
        navigate(`/user`, { state: { user: res.data } });
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
                  role="button"
                  disabled={!query.trim() || loading}
                >
                  {loading ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                    />
                  ) : (
                    <i className="bi bi-search" />
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
