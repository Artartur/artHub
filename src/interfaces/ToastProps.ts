import type { VoidReturn } from "./VoidReturn";

export interface ToastProps {
  message: string;
  show: boolean;
  onClose: VoidReturn;
  duration?: number;
}
