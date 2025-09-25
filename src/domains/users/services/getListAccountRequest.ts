import { tryCatch } from "@/shared/utils/try-catch";
import type { FieldsListAccountRequest } from "../types";

export async function getListAccountRequest({ course_id }: FieldsListAccountRequest) {
  const apiURLBase = process.env.API_URL_BASE || "http://localhost:8000";

  const listAccountRequestPromise = fetch(`${apiURLBase}/list-account-requests?course_id=${course_id}`, {
    method: "GET",
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
    data: accountRequestsData
  }
}