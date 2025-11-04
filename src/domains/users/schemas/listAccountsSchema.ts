import z from "zod";
import { USER_STATUSES } from "@/domains/users/constants";

export const listAccountsSchema = z.array(
  z.object({
    id: z.int(),
    name: z.string().min(1),
    last_name: z.string().min(1),
    email: z.email(),
    status: z.enum(Object.values(USER_STATUSES)),
  }),
);
export interface ListAccountsProps extends z.infer<typeof listAccountsSchema> {}
