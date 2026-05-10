import { useLocation, useNavigate, Navigate } from "react-router-dom";

export default function Repo() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const repo = state?.repo;

  if (!repo) return <Navigate to="/" replace />;

  return (
    <main className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <button
              className="btn btn-sm btn-outline-dark mb-4"
              aria-label="Voltar para a listagem de repositórios"
              onClick={() => navigate(-1)}
            >
              <i className="bi bi-arrow-left me-1" aria-hidden="true" />
              Voltar
            </button>

            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h1 className="fs-4 fw-bold text-primary mb-1">{repo.name}</h1>

                {repo.description && (
                  <p className="text-muted mb-4">{repo.description}</p>
                )}

                <div className="d-flex gap-4 text-muted small mb-4">
                  <span className="d-flex align-items-center gap-1">
                    <i
                      className="bi bi-star-fill text-warning"
                      aria-hidden="true"
                    />
                    {repo.stargazers_count}{" "}
                    {repo.stargazers_count === 1 ? "estrela" : "estrelas"}
                  </span>

                  {repo.language && (
                    <span className="d-flex align-items-center gap-1">
                      <i
                        className="bi bi-circle-fill"
                        aria-hidden="true"
                        style={{ fontSize: "0.6rem" }}
                      />
                      {repo.language}
                    </span>
                  )}
                </div>

                <a
                  href={repo.html_url}
                  className="btn btn-dark"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver ${repo.name} no GitHub (abre em nova aba)`}
                >
                  <i className="bi bi-github me-2" aria-hidden="true" />
                  Ver no GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
