import { processFetch } from "@/shared/utils/process-fetch";
import type { AccountRequestTeacherPayload } from "../schemas/accountRequestTeacherSchema";

export async function createAccountRequestTeacher(
  userRequestData: AccountRequestTeacherPayload,
) {
  const apiURLBase = process.env.API_URL_BASE || "http://localhost:8000";

  const accountRequestPromise = fetch(`${apiURLBase}/auth/account-request/teacher`, {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userRequestData),
  });

  const [error, accountRequestResult] = await processFetch(accountRequestPromise);
  if (error) return { success: false, error: accountRequestResult };

  return { success: true, error: null };
}
