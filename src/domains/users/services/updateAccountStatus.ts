import { processFetch } from "@/shared/utils/process-fetch";
import type { AccountStatusPayload } from "../types";

export async function updateAccountStatus({ user_id, newStatus }: AccountStatusPayload) {
  const apiURLBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const submitNewStatusPromise = fetch(`${apiURLBase}/auth/confirm-account`, {
    method: "PATCH",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: parseInt(user_id, 10), status: newStatus }),
  });

  const [error, response] = await processFetch(submitNewStatusPromise);
  if (error) return undefined;

  return response;
}
