import z from "zod";

export const createAccountSchema = z.object({
  id: z.string().min(1).transform((val) => parseInt(val)),
  password: z.string().min(1),
});

export type CreateAccountPayload = z.infer<typeof createAccountSchema>;