import { tryCatch } from "@/shared/utils/try-catch";
import { FieldsCreateAccount } from "../types";

export async function CreateAccountService(accountCreationData: FieldsCreateAccount) {
  const apiURLBase = process.env.API_URL_BASE || "http://localhost:3000";

  const createAccountPromise = fetch(`${apiURLBase}/auth/confirm-account`, {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(accountCreationData),
  });

  const createAccountResponse = await tryCatch(createAccountPromise);
  if (!createAccountResponse.success) {
    return {
      success: false,
      message: "Error al crear la cuenta. Inténtalo de nuevo más tarde."
    };
  }

  const accountData = await tryCatch(createAccountResponse.data.json());
  if (!accountData.success) {
    return {
      success: false,
      message: "Error al crear la cuenta."
    };
  }

  return accountData;
}