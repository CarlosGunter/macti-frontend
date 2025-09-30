import type { FieldsRequestAccount } from '../types';
import { processFetch } from '@/shared/utils/process-fetch';

/**
 * @param userRequestData datos del usuario que solicita la cuenta
 * @returns resultado del servicio
 */
export async function requestAccountService(userRequestData: FieldsRequestAccount) {
  const apiURLBase = process.env.API_URL_BASE || "http://localhost:8000";

  const parsedData = {
    name: userRequestData.name,
    last_name: userRequestData.apellido,
    email: userRequestData.email,
    course_id: parseInt(userRequestData.curso)
  }

  const accountRequestPromise = fetch(`${apiURLBase}/auth/request-account`, {
    method: "POST",
    cache: "no-store",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(parsedData),
  });

  const [error, getAccountRequests] = await processFetch(accountRequestPromise);
  if (error) return { success: false };

  return { success: true };
}