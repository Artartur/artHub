import type { GitHubUser } from "../../interfaces/GithubUser";

export default function UserInformations(user: GitHubUser) {
  const formatDate = () => {
    return new Date(user.created_at).toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body p-4">
        <h2 className="fs-6 fw-bold text-muted text-uppercase mb-3">
          Informações
        </h2>
        <ul className="list-unstyled mb-0 d-flex flex-column gap-2">
          <li className="d-flex align-items-center gap-2">
            <i className="bi bi-geo-alt text-muted" />
            <span>{user.location ?? "Usuário sem localização"}</span>
          </li>
          <li className="d-flex align-items-center gap-2">
            <i className="bi bi-link-45deg text-muted" />
            <span>
              {user.blog ? (
                <a
                  className="text-decoration-none"
                  href={
                    user.blog.startsWith("http")
                      ? user.blog
                      : `https://${user.blog}`
                  }
                  target="_blank"
                >
                  {user.blog}
                </a>
              ) : (
                "Usuário sem blog"
              )}
            </span>
          </li>
          <li className="d-flex align-items-center gap-2">
            <i className="bi bi-envelope text-muted" />
            <span>
              {user.email ? (
                <a
                  className="text-decoration-none"
                  href={`mailto:${user.email}`}
                  target="_blank"
                >
                  {user.email}
                </a>
              ) : (
                "Usuário sem email registrado"
              )}
            </span>
          </li>
          <li className="d-flex align-items-center gap-2">
            <i className="bi bi-building text-muted" />
            <span>{user.company ?? "Usuário sem companhia registrada"}</span>
          </li>
          <li className="d-flex align-items-center gap-2">
            <i className="bi bi-calendar3 text-muted" />
            <span>{formatDate()}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
