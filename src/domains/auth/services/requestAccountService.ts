import { tryCatch } from '@/shared/utils/try-catch';
import type { FieldsRequestAccount } from '../types';


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
    teacher: userRequestData.profesor,
    course_id: parseInt(userRequestData.curso)
  }

  const accountRequestPromise = fetch(`${apiURLBase}/auth/request-account`, {
    method: "POST",
    cache: "no-store",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(parsedData),
  });

  const getAccountRequests = await tryCatch(accountRequestPromise);
  if (!getAccountRequests.success) {
    return {
      success: false,
      message: "Error al solicitar la cuenta. Inténtalo de nuevo más tarde.",
      error: getAccountRequests.error?.message || "Error desconocido"
    }
  }

  return {
    success: true
  }
}