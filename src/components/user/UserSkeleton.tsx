import RepoCardSkeleton from "./RepoCardSkeleton";

export default function UserSkeleton() {
  return (
    <main className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="d-flex flex-column gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <RepoCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
