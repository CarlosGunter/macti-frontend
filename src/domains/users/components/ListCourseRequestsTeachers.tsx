"use client";

import { useQuery } from "@tanstack/react-query";
import Banner from "@/shared/components/feedback/Banner";
import { STATUS_BADGE_LABELS, USER_STATUSES } from "../constants";
import { fetchCourseRequestsTeachers } from "../services/fetchCourseRequestsTeachers";
import { useFilterStore } from "../stores/filterStore";
import type { UserStatus } from "../types";
import TeacherCourseRequestCard from "./ui/TeacherCourseRequestCard";

interface ListCourseRequestsTeachersProps {
  institute: string;
}

export default function ListCourseRequestsTeachers({
  institute,
}: ListCourseRequestsTeachersProps) {
  const { statusFilter, setStatusFilter } = useFilterStore();

  const {
    data: courseRequests,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["courseRequestsTeachers", institute, statusFilter],
    queryFn: async () => {
      return fetchCourseRequestsTeachers({
        institute,
        status: statusFilter || undefined,
      });
    },
    enabled: !!institute,
  });

  if (isLoading) {
    return <Banner message="Cargando solicitudes..." />;
  }

  if (error) {
    return <Banner message="Ocurrió un error al cargar las solicitudes" isError />;
  }

  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-end gap-2 h-full">
        <label htmlFor="status-filter" className="text-sm font-medium">
          Filtrar por estado del curso:
        </label>
        <select
          id="status-filter"
          value={statusFilter || ""}
          onChange={(e) => setStatusFilter((e.target.value as UserStatus) || null)}
          className="mt-1 border border-border bg-secondary text-secondary-foreground rounded-md px-2 py-1 text-sm focus:outline-none focus:border focus:border-primary"
        >
          <option value="">Todos</option>
          {Object.values(USER_STATUSES).map((status) => (
            <option key={status} value={status}>
              {STATUS_BADGE_LABELS[status]}
            </option>
          ))}
        </select>
      </div>

      {courseRequests?.map((request) => (
        <TeacherCourseRequestCard
          key={`${request.user.id}-${request.courses.id}`}
          request={request}
        />
      ))}
    </section>
  );
}
