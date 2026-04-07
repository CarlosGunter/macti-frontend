"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
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
  // const { token, authenticated, isLoading, isLoggingOut, login } = useLogin();

  const {
    data: enrolledCourses,
    isLoading: isEnrolledCoursesLoading,
    error,
  } = useQuery({
    queryKey: ["enrolledCourses", institute],
    queryFn: async () => {
      return fetchEnrolledCourses({
        institute,
      });
    },
    enabled: !!institute,
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
