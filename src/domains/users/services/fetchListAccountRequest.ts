import { processFetch } from "@/shared/utils/process-fetch";
import {
  accountsRequestSchema,
  type ListAccountsRequestProps,
} from "../schemas/listAccountsSchema";
import type { AccountRequestPayload } from "../types";

export async function fetchAccountRequests({
  course_id,
  institute,
  status,
  userToken,
}: AccountRequestPayload): Promise<ListAccountsRequestProps> {
  const apiURLBase = process.env.API_URL_BASE || "http://localhost:8000";

  const queryParams = new URLSearchParams({
    course_id: parseInt(course_id, 10).toString(),
    institute,
  });

  if (status) {
    queryParams.append("status", status);
  }

  const listAccountRequestPromise = fetch(
    `${apiURLBase}/auth/list-account-requests?${queryParams.toString()}`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken || ""}`,
      },
    },
  );

  const [error, listAccountRequests] = await processFetch(listAccountRequestPromise);
  if (error) return { alumno: [], docente: [] };

  const parsedListAccountRequests = accountsRequestSchema.safeParse(listAccountRequests);
  if (!parsedListAccountRequests.success) return { alumno: [], docente: [] };

  return parsedListAccountRequests.data;
}
