import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import BackButton from "../components/BackButton";
import RepoStats from "../components/user/RepoStats";

export default function Repo() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const repo = state?.repo;

  usePageTitle(repo?.name ?? "");

  if (!repo) return <Navigate to="/" replace />;

  return (
    <main className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <BackButton
              onClick={() => navigate(-1)}
              label="Voltar para a listagem de repositórios"
              className="mb-4"
            />

            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h1 className="fs-4 fw-bold text-primary mb-1">{repo.name}</h1>

                {repo.description && (
                  <p className="text-muted mb-4">{repo.description}</p>
                )}

                <RepoStats
                  stargazers_count={repo.stargazers_count}
                  language={repo.language}
                  showStarLabel
                  className="mb-4"
                />

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
