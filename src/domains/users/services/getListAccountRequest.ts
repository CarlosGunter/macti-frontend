import { tryCatch } from "@/shared/utils/try-catch";
import type { FieldsListAccountRequest } from "../types";

export async function getListAccountRequest({ course_id }: FieldsListAccountRequest) {
  const apiURLBase = process.env.API_URL_BASE || "http://localhost:8000";

  const listAccountRequestPromise = fetch(`${apiURLBase}/auth/list-accounts-requests?course_id=${parseInt(course_id)}`, {
    method: "GET",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });

  const listAccountRequests = await tryCatch(listAccountRequestPromise);
  if (!listAccountRequests.success) {
    return {
      success: false,
      message: "Error al obtener las solicitudes de cuenta. Inténtalo de nuevo más tarde."
    }
  }

  const accountRequestsData = await listAccountRequests.data.json();

  return {
    success: true,
    data: accountRequestsData.data
  }
}