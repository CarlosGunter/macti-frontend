import type { CreateAccountPayload } from "../schemas/createAccountSchema";
import { processFetch } from "@/shared/utils/process-fetch";

export async function CreateAccount(accountCreationData: CreateAccountPayload) {
  const apiURLBase = process.env.API_URL_BASE || "http://localhost:8000";

  const createAccountPromise = fetch(`${apiURLBase}/auth/create-account`, {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(accountCreationData),
  });

  const [error, createAccountResponse] = await processFetch(createAccountPromise);
  if (error) return undefined;

  return createAccountResponse;
}