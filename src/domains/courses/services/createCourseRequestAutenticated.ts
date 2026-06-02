import type { InstitutesType } from "@/shared/config/institutes";
import { processFetch } from "@/shared/utils/process-fetch";
import type {
  StudentCourseRequestAutenticatedPayload,
  TeacherCourseRequestAutenticatedPayload,
} from "../schemas/courseRequestAutenticatedSchema";

interface CreateCourseRequestAutenticatedProps {
  institute: InstitutesType;
  userRole: "student" | "teacher";
  courseRequestData:
    | StudentCourseRequestAutenticatedPayload
    | TeacherCourseRequestAutenticatedPayload;
}

export async function createCourseRequestAutenticated({
  institute,
  userRole,
  courseRequestData,
}: CreateCourseRequestAutenticatedProps) {
  const courseRequestAutenticatedPromise = fetch(
    `${process.env.NEXT_PUBLIC_PROXY_API_URL}/${institute}/register/request-account/${userRole}/authenticated?institute=${institute}`,
    {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(courseRequestData),
    },
  );

  const [error, courseRequestResult] = await processFetch(
    courseRequestAutenticatedPromise,
  );
  if (error)
    return {
      success: false,
      error:
        courseRequestResult?.message ||
        "Error al enviar la solicitud. Inténtalo de nuevo más tarde.",
    };

  return { success: true, error: null };
}
