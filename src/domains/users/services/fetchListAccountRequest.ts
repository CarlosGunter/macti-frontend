import { processFetch } from "@/shared/utils/process-fetch";
import {
  type ListAccountsProps,
  listAccountsSchema,
} from "../schemas/listAccountsSchema";
import type { AccountRequestPayload } from "../types";

export async function fetchAccountRequests({
  course_id,
  institute,
  status,
  userToken,
}: AccountRequestPayload): Promise<ListAccountsProps> {
  const apiURLBase = process.env.API_URL_BASE || "http://localhost:8000";

  const queryParams = new URLSearchParams({
    course_id: parseInt(course_id, 10).toString(),
    institute,
  });

  if (status) {
    queryParams.append("status", status);
  }

  const listAccountRequestPromise = fetch(
    `${apiURLBase}/auth/list-account-requests/students?${queryParams.toString()}`,
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
  if (error) return [];

  const parsedListAccountRequests = listAccountsSchema.safeParse(listAccountRequests);
  if (!parsedListAccountRequests.success) return [];

  return parsedListAccountRequests.data;
}
