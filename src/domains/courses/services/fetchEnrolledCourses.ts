import { processFetch } from "@/shared/utils/process-fetch";
import { enrolledCoursesSchema } from "../schemas/enrolledCoursesSchema";

export async function fetchEnrolledCourses({
  institute,
  token,
}: {
  institute: string;
  token: string;
}) {
  const apiURLBase = process.env.API_URL_BASE || "http://localhost:8000";

  const queryParams = new URLSearchParams({
    institute,
  });

  const enrolledCoursesPromise = fetch(
    `${apiURLBase}/courses/enrolled?${queryParams.toString()}`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const [error, enrolledCourses] = await processFetch(enrolledCoursesPromise);
  if (error) return [];

  const parsedEnrolledCourses = enrolledCoursesSchema.safeParse(enrolledCourses);
  if (!parsedEnrolledCourses.success) return [];

  return parsedEnrolledCourses.data;
}
