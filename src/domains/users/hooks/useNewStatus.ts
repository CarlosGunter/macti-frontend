import { useState, useTransition } from "react";
import { submitNewStatus } from "../services/submitNewStatus";
import type { UserStatusChangeParams } from "../types";

export function useNewStatus() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleNewStatus = ({ user_id, newStatus }: UserStatusChangeParams) => {
    startTransition(async () => {
      const result = await submitNewStatus({ user_id, newStatus });
      if (!result.success) {
        setError(result.message || "Error desconocido");
      }
    });
  }

  const animateDelete = (onDelete: (id: string) => void, id: string) => {
    setIsDeleted(true);
    setTimeout(() => {
      onDelete(id);
    }, 300);
  }

  return { isPending, handleNewStatus, error, isDeleted, animateDelete };
}
