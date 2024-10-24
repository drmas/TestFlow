import { type HTMLAttributes } from "react";
import { cn } from "~/lib/utils";
import { Button } from "./Button";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  ...props
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 p-4">
      <div
        className={cn(
          "relative w-full max-w-2xl rounded-lg bg-white shadow-xl dark:bg-gray-800",
          className
        )}
        {...props}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <Button variant="secondary" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}