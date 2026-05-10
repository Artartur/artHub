interface BackButtonProps {
  className?: string;
  label: string;
  onClick: () => void;
}

export default function BackButton({
  className = "",
  label,
  onClick,
}: BackButtonProps) {
  return (
    <button
      className={`btn btn-sm btn-outline-dark ${className}`}
      aria-label={label}
      onClick={onClick}
    >
      <i className="bi bi-arrow-left me-1" aria-hidden="true" />
      Voltar
    </button>
  );
}
