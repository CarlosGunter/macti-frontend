import z from "zod";

export const accountRequestSchema = z.object({
  institute: z.string("Instituto es obligatorio").min(1, "Instituto es obligatorio"),
  name: z.string().min(1, "El nombre es obligatorio"),
  last_name: z.string().min(1, "El apellido es obligatorio"),
  email: z.email("El correo electrónico no es válido"),
  course_id: z.coerce.number("Curso no válido").int().min(0, "El curso es obligatorio"),
});

export type AccountRequestPayload = z.infer<typeof accountRequestSchema>;
