import { useLocation, Navigate } from "react-router-dom";
import UserProfile from "../components/user/UserProfile";
import UserInformations from "../components/user/UserInformations";
import RepoCard from "../components/user/RepoCard";
import RepoCardSkeleton from "../components/user/RepoCardSkeleton";
import RepoSortFilter from "../components/user/RepoSortFilter";
import Toast from "../components/Toast";
import { useInfiniteRepos } from "../hooks/useInfiniteRepos";

export default function User() {
  const { state } = useLocation();
  const user = state?.user;

  const {
    error,
    hasMore,
    loading,
    repos,
    sentinelRef,
    setError,
    setStarSort,
    starSort,
  } = useInfiniteRepos(user?.login ?? "");

  if (!user) return <Navigate to="/" replace />;

  return (
    <main className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <UserProfile {...user} />
            <UserInformations {...user} />

            <RepoSortFilter starSort={starSort} onSortChange={setStarSort} />

            <div className="d-flex flex-column gap-3">
              {repos.map((repo) => (
                <RepoCard key={repo.id} {...repo} />
              ))}
            </div>

            {loading && (
              <div className="d-flex flex-column gap-3 py-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <RepoCardSkeleton key={i} />
                ))}
              </div>
            )}

            <div ref={sentinelRef} className="py-2 text-center">
              {!hasMore && repos.length > 0 && (
                <p className="text-muted small mb-0">
                  Todos os repositórios carregados.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Toast
        message={error ?? ""}
        show={!!error}
        onClose={() => setError(null)}
      />
    </main>
  );
}
