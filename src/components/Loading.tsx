export default function Loading({ loading }: { loading: boolean }) {
  return (
    <>
      {loading && (
        <div
          className="spinner-border spinner-border-sm text-secondary"
          role="status"
        >
          <span className="visually-hidden">Carregando...</span>
        </div>
      )}
    </>
  );
}
