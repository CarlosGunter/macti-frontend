import z from "zod";

export const listAccountsSchema = z.array(
  z.object({
    id: z.int(),
    name: z.string().min(1),
    last_name: z.string().min(1),
    email: z.email(),
    status: z.enum(["pending", "approved", "rejected", "created"]),
  }),
);
export interface ListAccountsProps extends z.infer<typeof listAccountsSchema> {}
