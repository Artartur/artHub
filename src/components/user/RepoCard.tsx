import { useNavigate } from "react-router-dom";
import type { GitHubRepo } from "../../interfaces/GithubRepo";

export default function RepoCard(repo: GitHubRepo) {
  const navigate = useNavigate();
  const { description, language, name, stargazers_count } = repo;

  return (
    <div
      className="card repo-card border-0 shadow-sm text-decoration-none"
      onClick={() => navigate("/repo", { state: { repo } })}
      style={{ cursor: "pointer" }}
    >
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h3 className="fs-6 fw-bold mb-0 text-primary">{name}</h3>
        </div>

        {description && <p className="text-muted small mb-3">{description}</p>}

        <div className="d-flex gap-3 text-muted small">
          <span className="d-flex align-items-center gap-1">
            <i className="bi bi-star" /> {stargazers_count}
          </span>

          {language && (
            <span className="d-flex align-items-center gap-1">
              <i className="bi bi-circle-fill" style={{ fontSize: "0.6rem" }} />
              {language}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
