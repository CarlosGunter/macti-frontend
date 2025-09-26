import { CreateAccountService } from "../services/createAccountService";
import { FieldsCreateAccount } from "../types";

export async function CreateAccountAction(prevState: unknown, formData: FormData) {
  const getData = Object.fromEntries(formData.entries().map(([key, value]) =>
    [key, value.toString()]
  ));

  // Llamar a la API para crear la cuenta
  const accountCreation = await CreateAccountService(
    getData as FieldsCreateAccount
  );

  if (!accountCreation.success) {
    return {
      success: false,
      message: "Error al crear la cuenta. Inténtalo de nuevo más tarde.",
      data: getData
    };
  }

  return {
    success: true,
    message: "Cuenta creada exitosamente. Ahora puedes iniciar sesión."
  }
}