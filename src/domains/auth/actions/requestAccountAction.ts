import { type AccountRequestPayload, accountRequestSchema } from "../schemas/accountRequestSchema";
import { createAccountRequest } from "../services/createAccountRequest";

/**
 * 
 * @param prevState estado previo
 * @param formData datos del formulario
 * @returns objeto con el resultado de la acción
 */
export async function requestAccountAction(prevState: unknown, formData: FormData) {
  const getData: unknown = Object.fromEntries(formData.entries());

  const validation = accountRequestSchema.safeParse(getData);
  if (!validation.success) {
    return {
      success: false,
      message: "Rellena correctamente todos los campos.",
      data: getData as AccountRequestPayload
    };
  }

  const accountRequestResult = await createAccountRequest(validation.data);
  if (!accountRequestResult.success) {
    return {
      success: false,
      message: "Error al solicitar la cuenta. Inténtalo de nuevo más tarde.",
      data: validation.data
    };
  }

  return {
    success: true,
    message: "Solicitud de cuenta enviada. Se enviará un correo de confirmación cuando el profesor a cargo del curso lo apruebe.",
    data: null
  }
}