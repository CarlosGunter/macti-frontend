import { Anchor } from "@/shared/components/ui/Anchor";
import { fetchCoursesServer } from "../services/fetchCoursesServer";
import CourseCard from "./ui/CourseCard";

interface ListInstituteCoursesProps {
  institute: string;
}

export default async function ListInstituteCourses({
  institute,
}: ListInstituteCoursesProps) {
  const courses = await fetchCoursesServer({ institute });

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-500">No hay cursos disponibles en este instituto.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {courses.map((course) => (
        <CourseCard
          key={`course-${course.id}`}
          courseId={course.id}
          title={course.displayname || course.fullname}
          description={course.summary || course.shortname}
        >
          <Anchor href={`/courses/${course.id}`}>Ver curso</Anchor>
        </CourseCard>
      ))}
    </div>
  );
}
