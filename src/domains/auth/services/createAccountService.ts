import { tryCatch } from "@/shared/utils/try-catch";
import { FieldsCreateAccount } from "../types";

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

  const createAccountResponse = await tryCatch(createAccountPromise);
  if (!createAccountResponse.success || !createAccountResponse.data.ok) {
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

  return {
    success: true,
    data: accountData
  };
}