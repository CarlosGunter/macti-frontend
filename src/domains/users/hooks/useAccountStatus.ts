import { useState, useTransition } from "react";
import { updateAccountStatus } from "../services/updateAccountStatus";
import type { AccountStatusPayload } from "../types";

export function useAccountStatus() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleNewStatus = ({ user_id, newStatus }: AccountStatusPayload) => {
    startTransition(async () => {
      const result = await updateAccountStatus({ user_id, newStatus });
      if (!result) {
        setError("Error al actualizar el estado del usuario");
      }
    });
  }

  const animateDelete = (onDelete: (id: string, status: 'pending' | 'approved' | 'rejected') => void, id: string, status: 'pending' | 'approved' | 'rejected') => {
    setIsDeleted(true);
    setTimeout(() => {
      onDelete(id, status);
    }, 300);
  }

  return { isPending, handleNewStatus, error, isDeleted, animateDelete };
}
