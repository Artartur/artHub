export default function RepoCardSkeleton() {
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="placeholder-glow mb-2">
          <span className="placeholder col-5 rounded" />
        </div>
        <div className="placeholder-glow mb-3">
          <span
            className="placeholder col-8 rounded"
            style={{ height: "0.75rem" }}
          />
        </div>
        <div className="d-flex gap-3 placeholder-glow">
          <span
            className="placeholder col-2 rounded"
            style={{ height: "0.75rem" }}
          />
          <span
            className="placeholder col-2 rounded"
            style={{ height: "0.75rem" }}
          />
        </div>
      </div>
    </div>
  );
}
