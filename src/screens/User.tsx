import { useLocation } from "react-router-dom";
import UserProfile from "../components/user/UserProfile";
import UserInformations from "../components/user/UserInformations";
import RepoCard from "../components/user/RepoCard";
import Loading from "../components/Loading";
import { useInfiniteRepos } from "../hooks/useInfiniteRepos";
import { useState } from "react";

export default function User() {
  const { state } = useLocation();
  const [direction, setDirection] = useState<"asc" | "desc">("desc");

  const user = state?.user;

  const { repos, loading, hasMore, sentinelRef } = useInfiniteRepos(
    user.login,
    direction,
  );

  return (
    <main className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <UserProfile {...user} />
            <UserInformations {...user} />

            <div className="d-flex align-items-center justify-content-between mb-3">
              <h2 className="fs-6 fw-bold text-muted text-uppercase mb-0">
                Repositórios
              </h2>
              <div className="btn-group btn-group-sm" role="group" aria-label="Ordenação">
                <button
                  type="button"
                  className={`btn ${direction === "desc" ? "btn-dark" : "btn-outline-dark"}`}
                  onClick={() => setDirection("desc")}
                >
                  <i className="bi bi-sort-down me-1" />
                  Mais estrelas
                </button>
                <button
                  type="button"
                  className={`btn ${direction === "asc" ? "btn-dark" : "btn-outline-dark"}`}
                  onClick={() => setDirection("asc")}
                >
                  <i className="bi bi-sort-up me-1" />
                  Menos estrelas
                </button>
              </div>
            </div>

            <div className="d-flex flex-column gap-3">
              {repos.map((repo) => (
                <RepoCard key={repo.id} {...repo} />
              ))}
            </div>

            <div ref={sentinelRef} className="py-3 text-center">
              <Loading loading={loading} />

              {!hasMore && repos.length > 0 && (
                <p className="text-muted small mb-0">
                  Todos os repositórios carregados.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
