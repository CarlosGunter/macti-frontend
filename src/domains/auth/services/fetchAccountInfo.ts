import { processFetch } from "@/shared/utils/process-fetch";
import { createAccountResponseSchema } from "../schemas/createAccountSchema";

export async function fetchAccountInfo(token: string) {
  const apiURLBase = process.env.API_URL_BASE || "http://localhost:8000";

  const verifyTokenPromise = fetch(`${apiURLBase}/auth/confirmacion?token=${token}`, {
    method: "GET",
    cache: "no-store",
  });

  const [error, userData] = await processFetch(verifyTokenPromise);
  if (error) return undefined;

  const parsedUserData = createAccountResponseSchema.safeParse(userData);
  if (!parsedUserData.success) return undefined;

  return parsedUserData.data;
}
