import { requestAccountService } from "../services/createAccountRequest";
import { AccountRequestPayload } from "../types";

/**
 * 
 * @param prevState estado previo
 * @param formData datos del formulario
 * @returns objeto con el resultado de la acción
 */
export async function requestAccountAction(prevState: unknown, formData: FormData) {
  // El FormData es un objeto que contiene los datos del formulario
  const getData = Object.fromEntries(formData.entries().map(([key, value]) =>
    [key, value.toString()]
  ));

  // Llamar a la API para solicitar la cuenta
  const accountRequestResult = await requestAccountService(
    getData as AccountRequestPayload
  );
  if (!accountRequestResult.success) {
    return {
      success: false,
      message: "Error al solicitar la cuenta. Inténtalo de nuevo más tarde.",
      data: getData
    };
  }

  return {
    success: true,
    message: "Solicitud de cuenta enviada. Se enviará un correo de confirmación cuando el profesor a cargo del curso lo apruebe."
  }
}