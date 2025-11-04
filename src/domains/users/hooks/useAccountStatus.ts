import { useState, useTransition } from "react";
import { updateAccountStatus } from "../services/updateAccountStatus";
import type { AccountStatusPayload, UserStatus } from "../types";

interface AccountStatusHandler extends AccountStatusPayload {
  onChangeStatus: (id: number, status: UserStatus) => void;
}

export function useAccountStatus() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const updateStatus = ({ user_id, newStatus, onChangeStatus }: AccountStatusHandler) => {
    startTransition(async () => {
      const result = await updateAccountStatus({ user_id, newStatus });
      if (!result) {
        setError("Error al actualizar el estado del usuario");
        return;
      }

      onChangeStatus(user_id, newStatus);
    });
  };

  return { isPending, updateStatus, error };
}
