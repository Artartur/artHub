export interface ToastProps {
  duration?: number;
  message: string;
  onClose: () => void;
  show: boolean;
}
