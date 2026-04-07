import { processFetch } from "@/shared/utils/process-fetch";
import { enrolledCoursesSchema } from "../schemas/enrolledCoursesSchema";

export async function fetchEnrolledCourses({ institute }: { institute: string }) {
  const queryParams = new URLSearchParams({
    institute,
  });

  const enrolledCoursesPromise = fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/${institute}/courses/enrolled?${queryParams.toString()}`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const [error, enrolledCourses] = await processFetch(enrolledCoursesPromise);
  console.log({ enrolledCourses });
  if (error) return [];

  const parsedEnrolledCourses = enrolledCoursesSchema.safeParse(enrolledCourses);
  if (!parsedEnrolledCourses.success) return [];

  return parsedEnrolledCourses.data;
}
