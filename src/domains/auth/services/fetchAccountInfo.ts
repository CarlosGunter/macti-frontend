import { processFetch } from "@/shared/utils/process-fetch";

export async function fetchAccountInfo(token: string) {
  const apiURLBase = process.env.API_URL_BASE || "http://localhost:8000";

  const verifyTokenPromise = fetch(`${apiURLBase}/auth/confirmacion?token=${token}`, {
    method: "GET",
    cache: "no-store",
  });

  const [error, userData] = await processFetch(verifyTokenPromise);
  if (error) return undefined;
    
  return userData;
}