import { apiURLBase } from "@/shared/config/api";
import { processFetch } from "@/shared/utils/process-fetch";
import type { AccountStatusPayload } from "../types";

export async function updateAccountStatus({ user_id, newStatus }: AccountStatusPayload) {
  const submitNewStatusPromise = fetch(`${apiURLBase}/auth/change-status`, {
    method: "PATCH",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: user_id, status: newStatus }),
  });

  const [error, response] = await processFetch(submitNewStatusPromise);
  if (error) return undefined;

  return response;
}
