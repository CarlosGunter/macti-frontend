import { CreateAccount } from "../services/createAccount";
import { type CreateAccountPayload, createAccountSchema } from "../schemas/createAccountSchema";

export async function createAccountAction(prevState: unknown, formData: FormData) {
  const getData: unknown = Object.fromEntries(formData.entries());

  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirm_password")?.toString();
  if (password !== confirmPassword) {
    return {
      message: "Las contraseñas no coinciden.",
      data: getData as CreateAccountPayload,
    };
  }

  const validation = createAccountSchema.safeParse(getData);
  if (!validation.success) {
    return {
      message: "Rellena correctamente todos los campos.",
      data: getData as CreateAccountPayload,
    };
  }

  const accountCreation = await CreateAccount(validation.data);
  if (!accountCreation) {
    return {
      message: "Error al crear la cuenta. Inténtalo de nuevo más tarde.",
      data: validation.data
    };
  }

  return {
    message: "Cuenta creada exitosamente. Ahora puedes iniciar sesión.",
    data: null
  };
}