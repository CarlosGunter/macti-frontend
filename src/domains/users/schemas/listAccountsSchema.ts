import z from "zod";
import { USER_STATUSES } from "@/domains/users/constants";

export const listAccountsRequestSchema = z.array(
  z.object({
    id: z.int(),
    name: z.string().min(1),
    last_name: z.string().min(1),
    email: z.email(),
    status: z.enum(Object.values(USER_STATUSES)),
  }),
);

export const accountsRequestSchema = z.object({
  alumno: z.optional(listAccountsRequestSchema).default([]),
  docente: z.optional(listAccountsRequestSchema).default([]),
});

export interface ListAccountsRequestProps extends z.infer<typeof accountsRequestSchema> {}
