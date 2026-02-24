"use client";

import { useQuery } from "@tanstack/react-query";
import Banner from "@/shared/components/feedback/Banner";
import { Anchor } from "@/shared/components/ui/Anchor";
import { privilegeRoles } from "@/shared/config/rolesMap";
import { useLogin } from "@/shared/providers/LoginContext";
import { fetchEnrolledCourses } from "../services/fetchEnrolledCourses";
import CourseCard from "./ui/CourseCard";

interface ListEnrolledCoursesProps {
  institute: string;
}

export default function ListEnrolledCourses({ institute }: ListEnrolledCoursesProps) {
  const { token, authenticated, isLoading, login } = useLogin();

  // if (isLoading && !token) notFound();
  if (!isLoading && !authenticated) login();

  const {
    data: enrolledCourses,
    isLoading: isEnrolledCoursesLoading,
    error,
  } = useQuery({
    queryKey: ["enrolledCourses", institute],
    queryFn: async () => {
      const currentToken = localStorage.getItem(`${institute}_token`);
      if (!currentToken) throw new Error("No token available");

      return fetchEnrolledCourses({
        institute,
        token: currentToken,
      });
    },
    enabled: authenticated && !!token && !!institute,
  });

  if (isEnrolledCoursesLoading) {
    return <Banner message="Cargando cursos inscritos..." />;
  }

  if (error) {
    return <Banner message="Error al cargar los cursos inscritos." isError />;
  }

  return (
    <article className="grid gap-4">
      {enrolledCourses && enrolledCourses.length > 0 ? (
        enrolledCourses.map((course) => (
          <CourseCard
            courseId={course.id}
            key={course.id}
            title={course.displayname}
            description={course.summary}
          >
            {course.role.some((r) => privilegeRoles.high.includes(r)) && (
              <Anchor href={`./${course.id}/solicitudes`}>Solicitudes</Anchor>
            )}
          </CourseCard>
        ))
      ) : (
        <Banner message="No hay cursos inscritos." />
      )}
    </article>
  );
}
