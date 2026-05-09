import { AxiosError } from "axios";

const STATUS_MESSAGES: Record<number, string> = {
  404: "Usuário não encontrado.",
  403: "Limite de requisições atingido. Tente novamente em alguns minutos.",
  422: "Nome de usuário inválido.",
  503: "Serviço do GitHub indisponível. Tente novamente mais tarde.",
};

export default function getGithubErrorMessage(error: Error): string {
  if (error instanceof AxiosError) {
    if (!error.response) return "Sem conexão com a internet";

    return (
      STATUS_MESSAGES[error.response.status] ??
      "Erro inesperado. Tente novamente."
    );
  }

  return "Erro inesperado. Tente novamente.";
}
