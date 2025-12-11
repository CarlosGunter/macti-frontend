import { processFetch } from "@/shared/utils/process-fetch";
import type { AccountRequestPayload } from "../schemas/accountRequestSchema";

/**
 * @param userRequestData datos del usuario que solicita la cuenta
 * @returns resultado del servicio
 */
export async function createAccountRequest(userRequestData: AccountRequestPayload) {
  const apiURLBase = process.env.API_URL_BASE || "http://localhost:8000";

  const accountRequestPromise = fetch(`${apiURLBase}/auth/request-account/alumno`, {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userRequestData),
  });

  const [error, _getAccountRequests] = await processFetch(accountRequestPromise);
  if (error) return { success: false };

  return { success: true };
}
