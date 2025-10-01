import { tryCatch } from "@/shared/utils/try-catch";
import { FieldsCreateAccount } from "../types";
import { processFetch } from "@/shared/utils/process-fetch";

export async function CreateAccountService(accountCreationData: FieldsCreateAccount) {
  const apiURLBase = process.env.API_URL_BASE || "http://localhost:8000";

  const parsedData = {
    id: parseInt(accountCreationData.id),
    password: accountCreationData.password
  }

  const createAccountPromise = fetch(`${apiURLBase}/auth/create-account`, {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsedData),
  });

  const [error, createAccountResponse] = await processFetch(createAccountPromise);
  if (error) return undefined;

  return createAccountResponse;
}