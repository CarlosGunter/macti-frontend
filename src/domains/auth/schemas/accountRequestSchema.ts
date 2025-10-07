import z from 'zod';

export const accountRequestSchema = z.object({
  institute: z.string().min(1),
  name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.email(),
  course_id: z.string().min(1).transform((val) => parseInt(val)),
});

export type AccountRequestPayload = z.infer<typeof accountRequestSchema>;
