import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";

export default function NotFound() {
  const navigate = useNavigate();
  usePageTitle("Página não encontrada");

  const goToHome = () => navigate("/");

  return (
    <main className="min-vh-100 bg-light d-flex align-items-center py-5">
      <div className="container text-center">
        <h1 className="display-1 fw-bold text-muted">404</h1>
        <p className="fs-5 text-muted mb-4">Página não encontrada.</p>
        <button
          className="btn btn-dark"
          aria-label="Voltar para a página inicial"
          onClick={goToHome}
        >
          <i className="bi bi-house me-2" aria-hidden="true" />
          Voltar para o início
        </button>
      </div>
    </main>
  );
}
