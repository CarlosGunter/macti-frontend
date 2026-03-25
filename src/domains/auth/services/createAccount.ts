import { apiURLBase } from "@/shared/config/api";
import { processFetch } from "@/shared/utils/process-fetch";
import type { CreateAccountPayload } from "../schemas/createAccountSchema";

export async function CreateAccount(accountCreationData: CreateAccountPayload) {
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
