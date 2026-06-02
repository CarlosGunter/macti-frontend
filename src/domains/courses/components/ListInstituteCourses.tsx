import { Anchor } from "@/shared/components/ui/Anchor";
import type { InstitutesType } from "@/shared/config/institutes";
import { fetchCoursesServer } from "../services/fetchCoursesServer";
import CourseCard from "./ui/CourseCard";
import RequestJoinCourseButton from "./ui/RequestJoinCourseButton";

interface ListInstituteCoursesProps {
  institute: InstitutesType;
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
          <RequestJoinCourseButton institute={institute} courseId={course.id} />
          <Anchor href={`/courses/${course.id}`}>Ver curso</Anchor>
        </CourseCard>
      ))}
    </div>
  );
}
