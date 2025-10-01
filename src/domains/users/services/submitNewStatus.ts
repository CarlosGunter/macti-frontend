import { tryCatch } from "@/shared/utils/try-catch";
import type { UserStatusChangeParams } from "../types";
import { processFetch } from "@/shared/utils/process-fetch";

export async function submitNewStatus({ user_id, newStatus }: UserStatusChangeParams) {
  const apiURLBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const submitNewStatusPromise = fetch(`${apiURLBase}/auth/confirm-account`, {
    method: "PATCH",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: parseInt(user_id), status: newStatus }),
  });

  const [error, response] = await processFetch(submitNewStatusPromise);
  if (error) return undefined;

  return response;
}