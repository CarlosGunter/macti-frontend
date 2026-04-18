import z from "zod";

export const createAccountSchema = z.object({
  user_id: z.coerce
    .number()
    .int("El ID debe ser un número entero.")
    .min(0, "El ID debe tener al menos 7 dígitos.")
    .max(99999999, "El ID no puede tener más de 8 dígitos."),
  new_password: z.string().min(1, "La contraseña es requerida."),
});
export type CreateAccountPayload = z.infer<typeof createAccountSchema>;

export const createAccountResponseSchema = z.object({
  id: z.number().int(),
  email: z.email(),
});
export type CreateAccountResponse = z.infer<typeof createAccountResponseSchema>;
