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
            href={`/${institute}/solicitudes/${course.id}`}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            Ver curso
          </Link>
        </CourseCard>
      ))}
    </div>
  );
}
