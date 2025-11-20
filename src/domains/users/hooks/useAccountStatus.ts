import { useState, useTransition } from "react";
import { updateAccountStatus } from "../services/updateAccountStatus";
import type { AccountStatusPayload } from "../types";

interface AccountStatusHandler extends AccountStatusPayload {
  onSuccess: () => void;
}

export function useAccountStatus() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const updateStatus = ({ user_id, newStatus, onSuccess }: AccountStatusHandler) => {
    startTransition(async () => {
      const result = await updateAccountStatus({ user_id, newStatus });
      if (!result) {
        setError("Error al actualizar el estado del usuario");
        return;
      }

      onSuccess();
    });
  };

  return { isPending, updateStatus, error };
}
