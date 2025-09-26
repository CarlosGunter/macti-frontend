import { tryCatch } from "@/shared/utils/try-catch";
import type { UserStatusChangeParams } from "../types";

export async function submitNewStatus({ user_id, newStatus }: UserStatusChangeParams) {
  const apiURLBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const submitNewStatusPromise = fetch(`${apiURLBase}/auth/confirm-account`, {
    method: "PATCH",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: parseInt(user_id), status: newStatus }),
  });

  const submitNewStatusResponse = await tryCatch(submitNewStatusPromise);
  if (!submitNewStatusResponse.success) {
    return {
      success: false,
      message: "Error al actualizar el estado de la solicitud. Inténtalo de nuevo más tarde."
    }
  }

  const responseData = await submitNewStatusResponse.data.json();
  if (!responseData.success) {
    return {
      success: false,
      message: "Error al actualizar el estado de la solicitud. Inténtalo de nuevo más tarde."
    }
  }

  return {
    success: true,
    message: "El estado de la solicitud se ha actualizado correctamente."
  };
}