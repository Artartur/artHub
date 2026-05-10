import type { RepoStatsProps } from "../../interfaces/RepoStatsProps";

export default function RepoStats({
  stargazers_count,
  language,
  showStarLabel = false,
  className = "",
}: RepoStatsProps) {
  return (
    <div className={`d-flex text-muted small ${className}`}>
      <span className="d-flex align-items-center gap-1 me-3">
        <i
          className={
            showStarLabel ? "bi bi-star-fill text-warning" : "bi bi-star"
          }
          aria-hidden="true"
        />
        {stargazers_count}
        {showStarLabel && (
          <span>{stargazers_count === 1 ? "estrela" : "estrelas"}</span>
        )}
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
  );
}
