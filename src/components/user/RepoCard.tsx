import { useNavigate } from "react-router-dom";
import type { GitHubRepo } from "../../interfaces/GithubRepo";

export default function RepoCard(repo: GitHubRepo) {
  const navigate = useNavigate();
  const { description, language, name, stargazers_count } = repo;

  const goToRepo = () => navigate("/repo", { state: { repo } });

  return (
    <div
      className="card repo-card border-0 shadow-sm text-decoration-none"
      aria-label={`Ver detalhes do repositório ${name}`}
      role="button"
      tabIndex={0}
      onClick={goToRepo}
      onKeyDown={(e) => e.key === "Enter" && goToRepo()}
    >
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h3 className="fs-6 fw-bold mb-0 text-primary">{name}</h3>
        </div>

        {description && <p className="text-muted small mb-3">{description}</p>}

        <div className="d-flex gap-3 text-muted small">
          <span className="d-flex align-items-center gap-1">
            <i className="bi bi-star" aria-hidden="true" /> {stargazers_count}
          </span>

          {language && (
            <span className="d-flex align-items-center gap-1">
              <i
                className="bi bi-circle-fill"
                style={{ fontSize: "0.6rem" }}
                aria-hidden="true"
              />
              {language}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
