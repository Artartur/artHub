import { useNavigate } from "react-router-dom";
import BackButton from "../BackButton";
import type { GitHubUser } from "../../interfaces/GithubUser";

export default function UserProfile(user: GitHubUser) {
  const navigate = useNavigate();

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body text-center p-4">
        <div className="d-flex justify-content-start mb-2">
          <BackButton
            onClick={() => navigate("/", { replace: true })}
            label="Voltar para a página inicial"
          />
        </div>
        <img
          src={user.avatar_url}
          className="rounded-circle mb-3"
          alt={`Avatar de ${user.name}`}
          width={120}
          height={120}
        />
        <h1 className="fs-4 fw-bold mb-0">{user.name}</h1>
        <p className="text-muted mb-3">
          <a
            className="text-decoration-none text-black"
            href={`https://github.com/${user.login}`}
            target="_blank"
            aria-label={`Perfil de ${user.login} no GitHub (abre em nova aba)`}
            rel="noopener noreferrer"
          >
            @{user.login}
          </a>
        </p>
        <p className="mb-4">{user.bio ?? "Usuário sem bio"}</p>
        <div className="row g-3 text-center">
          <div className="col-4">
            <div className="fw-bold fs-5">{user.public_repos}</div>
            <div className="text-muted small">Repositórios</div>
          </div>
          <div className="col-4">
            <div className="fw-bold fs-5">{user.followers}</div>
            <div className="text-muted small">Seguidores</div>
          </div>
          <div className="col-4">
            <div className="fw-bold fs-5">{user.following}</div>
            <div className="text-muted small">Seguindo</div>
          </div>
        </div>
      </div>
    </div>
  );
}
