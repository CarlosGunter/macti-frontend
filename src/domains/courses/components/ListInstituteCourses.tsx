import Link from "next/link";
import { fetchCourses } from "@/shared/services/fetchCourses";
import CourseCard from "./CourseCard";

interface ListInstituteCoursesProps {
  institute: string;
}

export default async function ListInstituteCourses({
  institute,
}: ListInstituteCoursesProps) {
  const courses = await fetchCourses({ institute });

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-500">No hay cursos disponibles en este instituto.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 p-6">
      {courses.map((course) => (
        <CourseCard
          key={`course-${course.id}`}
          courseId={course.id}
          title={course.displayname || course.fullname}
          description={course.summary || course.shortname}
        >
          <Link
            href=""
            className="flex justify-center items-center gap-2 p-2 rounded-lg transition-shadow duration-200 bg-black text-white hover:ring-2 hover:ring-gray-900 dark:bg-gray-200 dark:text-black dark:hover:ring-offset-2 dark:hover:ring-current"
          >
            Ver curso
          </Link>
        </CourseCard>
      ))}
    </div>
  );
}
