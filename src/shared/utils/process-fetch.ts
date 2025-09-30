import { tryCatch } from "./try-catch";

type Success = [error: false, data: unknown];
type Failure = [error: true, data: null | undefined];
type FetchResult = Success | Failure;

/**
 * Helper para hacer fetch y manejar errores
 * @param fetchPromise promesa del fetch
 * @returns tupla con error y datos
 */
export async function processFetch(fetchPromise: Promise<Response>): Promise<FetchResult> {

  const fetchResponse = await tryCatch(fetchPromise);
  if (fetchResponse.error || (fetchResponse.data && !fetchResponse.data.ok)) {
    return [true, undefined];
  }

  const fetchData = await tryCatch(fetchResponse.data!.json());
  if (fetchData.error) {
    return [true, null];
  }

  return [false, fetchData.data];
}