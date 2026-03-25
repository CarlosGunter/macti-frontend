import { apiURLBase } from "@/shared/config/api";
import { processFetch } from "@/shared/utils/process-fetch";
import type { AccountRequestTeacherPayload } from "../schemas/accountRequestTeacherSchema";

export async function createAccountRequestTeacher(
  userRequestData: AccountRequestTeacherPayload,
) {
  const accountRequestPromise = fetch(`${apiURLBase}/auth/request-account/teacher`, {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userRequestData),
  });

  const [error, accountRequestResult] = await processFetch(accountRequestPromise);
  if (error) return { success: false, error: accountRequestResult };

  return { success: true, error: null };
}
