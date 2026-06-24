import { processFetch } from "@/shared/utils/process-fetch";
import type { UpdateRequestStatusPayload } from "../types";

export async function updateRequestStatus({
  institute,
  request_id,
  newStatus,
  role,
}: UpdateRequestStatusPayload) {
  const submitNewStatusPromise = fetch(
    `/api/auth/${institute}/register/update-request-status/${role}`,
    {
      method: "PATCH",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request_id, new_status: newStatus, institute }),
    },
  );

  const [error, response] = await processFetch(submitNewStatusPromise);
  if (error) return undefined;

  return response;
}
