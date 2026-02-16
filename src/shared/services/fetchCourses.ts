import { listCoursesSchema } from "../schemas/listCoursesShema";
import type { ListCoursesPayload } from "../types/listCoursesPayload";
import { processFetch } from "../utils/process-fetch";

export async function fetchCourses({ institute, ids }: ListCoursesPayload) {
  const apiURLBase = process.env.API_URL_BASE || "http://localhost:8000";

  const queryParams = new URLSearchParams({ institute });
  if (ids && Array.isArray(ids)) {
    ids.forEach((id) => {
      queryParams.append("ids", String(id));
    });
  }

  const listCoursesPromise = fetch(`${apiURLBase}/courses?${queryParams.toString()}`, {
    method: "GET",
    next: { revalidate: 300 },
    headers: { "Content-Type": "application/json" },
  });

  const [error, listCourses] = await processFetch(listCoursesPromise);
  if (error) return undefined;

  const parsedListCourses = listCoursesSchema.safeParse(listCourses);
  if (!parsedListCourses.success) return undefined;

  return parsedListCourses.data;
}
