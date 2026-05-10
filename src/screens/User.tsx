import { useLocation, useParams, Navigate } from "react-router-dom";
import { useInfiniteRepos } from "../hooks/useInfiniteRepos";
import { usePageTitle } from "../hooks/usePageTitle";
import { useUser } from "../hooks/useUser";

import UserInformations from "../components/user/UserInformations";
import UserProfile from "../components/user/UserProfile";
import RepoCard from "../components/repo/RepoCard";
import RepoCardSkeleton from "../components/repo/RepoCardSkeleton";
import RepoSortFilter from "../components/repo/RepoSortFilter";
import Toast from "../components/Toast";
import UserSkeleton from "../components/user/UserSkeleton";

export default function User() {
  const { state } = useLocation();
  const { username } = useParams<{ username: string }>();

  const {
    error,
    hasMore,
    loading,
    repos,
    sentinelRef,
    setError,
    setStarSort,
    starSort,
  } = useInfiniteRepos(username ?? "");

  const {
    user,
    loading: loadingUser,
    error: userError,
  } = useUser(username, state?.user);

  usePageTitle(user?.name ?? "");

  if (loadingUser) return <UserSkeleton />;

  if (userError || !user) return <Navigate to="/" replace />;

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

            {!loading && !hasMore && repos.length === 0 && (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-folder-x fs-1 d-block mb-2" />
                <p className="mb-0">
                  Este usuário não possui repositórios públicos.
                </p>
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
