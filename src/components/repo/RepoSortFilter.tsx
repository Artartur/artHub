import type { RepoSortFilterProps } from "../../interfaces/RepoSortFilterProps";

export default function RepoSortFilter({
  starSort,
  onSortChange,
}: RepoSortFilterProps) {
  return (
    <div className="d-flex align-items-center justify-content-between mb-3">
      <h2 className="fs-6 fw-bold text-muted text-uppercase mb-0">
        Repositórios
      </h2>
      <div className="btn-group btn-group-sm d-flex align-items-center">
        <button
          className={`btn ${starSort === "desc" ? "btn-dark" : "btn-outline-dark"}`}
          aria-label="Ordenar por mais estrelas primeiro"
          aria-pressed={starSort === "desc"}
          onClick={() => onSortChange(starSort === "desc" ? null : "desc")}
        >
          ★ desc
        </button>
        <button
          className={`btn ${starSort === "asc" ? "btn-dark" : "btn-outline-dark"}`}
          aria-label="Ordenar por menos estrelas primeiro"
          aria-pressed={starSort === "asc"}
          onClick={() => onSortChange(starSort === "asc" ? null : "asc")}
        >
          ★ asc
        </button>
      </div>
    </div>
  );
}
