import { CreateAccountService } from "../services/createAccountService";
import { FieldsCreateAccount } from "../types";

export function CreateAccountAction(prevState: unknown, formData: FormData) {
  const getData = Object.fromEntries(formData.entries().map(([key, value]) =>
    [key, value.toString()]
  ));

  // Llamar a la API para crear la cuenta
  CreateAccountService(getData as FieldsCreateAccount);

  return {
    success: true,
    message: "Cuenta creada exitosamente. Ahora puedes iniciar sesión.",
    data: getData
  }
}