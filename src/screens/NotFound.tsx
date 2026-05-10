import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  const goToHome = () => navigate("/");

  return (
    <main className="min-vh-100 bg-light d-flex align-items-center py-5">
      <div className="container text-center">
        <h1 className="display-1 fw-bold text-muted">404</h1>
        <p className="fs-5 text-muted mb-4">Página não encontrada.</p>
        <button className="btn btn-dark" onClick={goToHome}>
          <i className="bi bi-house me-2" />
          Voltar para o início
        </button>
      </div>
    </main>
  );
}
