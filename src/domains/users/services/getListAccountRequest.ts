import type { FieldsListAccountRequest } from "../types";
import { processFetch } from "@/shared/utils/process-fetch";

export async function getListAccountRequest({ course_id }: FieldsListAccountRequest) {
  const apiURLBase = process.env.API_URL_BASE || "http://localhost:8000";

  const listAccountRequestPromise = fetch(`${apiURLBase}/auth/list-accounts-requests?course_id=${parseInt(course_id)}`, {
    method: "GET",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });

  const [error, listAccountRequests] = await processFetch(listAccountRequestPromise);
  if (error) return undefined;

  return listAccountRequests;
}