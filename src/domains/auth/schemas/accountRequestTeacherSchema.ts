import { z } from "zod";

export const accountRequestTeacherSchema = z.object({
  institute: z.string().min(1, "La facultad es requerida."),
  name: z.string().min(1, "El nombre es requerido."),
  last_name: z.string().min(1, "El apellido es requerido."),
  email: z.email("El correo electrónico no es válido."),
  course: z.string().min(1, "El curso es requerido."),
  groups: z
    .array(
      z.coerce
        .number("Solo se permiten números en los grupos")
        .int("Grupo no válido")
        .min(0, "Grupo no válido"),
    )
    .min(1, "Al menos un grupo es requerido."),
});

export type AccountRequestTeacherPayload = z.infer<typeof accountRequestTeacherSchema>;
