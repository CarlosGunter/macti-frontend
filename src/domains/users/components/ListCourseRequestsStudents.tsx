"use client";

import { useQuery } from "@tanstack/react-query";
import { Inbox } from "lucide-react";
import { notFound } from "next/navigation";
import Banner from "@/shared/components/feedback/Banner";
import { STATUS_BADGE_LABELS, USER_STATUSES } from "../constants";
import { fetchCourseRequestsStudents } from "../services/fetchCourseRequestStudents";
import { useFilterStore } from "../stores/filterStore";
import type { UserStatus } from "../types";
import StudentCourseRequestCard from "./ui/StudentCourseRequestCard";

interface ListCourseRequestStudentProps {
  course_id: string;
  institute: string;
}

export default function ListCourseRequestsStudent({
  course_id,
  institute,
}: ListCourseRequestStudentProps) {
  const { statusFilter, setStatusFilter } = useFilterStore();

  const {
    data: accountRequests,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["courseRequestsStudents", course_id, institute, statusFilter],
    queryFn: async () => {
      return fetchCourseRequestsStudents({
        course_id,
        institute,
        status: statusFilter || undefined,
      });
    },
    enabled: !!institute,
  });

  if (!institute) notFound();

  if (isLoading) {
    return <Banner message="Cargando solicitudes..." />;
  }

  if (error) {
    return <Banner message="Ocurrió un error al cargar las solicitudes" isError />;
  }

  if (!accountRequests?.length) {
    return (
      <section className="grid gap-4">
        <div className="flex items-center justify-end gap-2 h-full">
          <label htmlFor="status-filter" className="text-sm font-medium">
            Filtrar por estado:
          </label>
          <select
            id="status-filter"
            value={statusFilter || ""}
            onChange={(e) => setStatusFilter((e.target.value as UserStatus) || null)}
            className="mt-1 rounded-md border border-border bg-secondary px-2 py-1 text-sm text-secondary-foreground focus:border focus:border-primary focus:outline-none"
          >
            <option value="">Todos</option>
            {Object.values(USER_STATUSES).map((status) => (
              <option key={status} value={status}>
                {STATUS_BADGE_LABELS[status]}
              </option>
            ))}
          </select>
        </div>

        <article className="grid gap-3 rounded-2xl border border-dashed border-border/70 bg-card/70 p-6 text-card-foreground shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-secondary/40 text-card-foreground/60">
              <Inbox className="h-5 w-5" />
            </span>
            <div className="grid gap-1">
              <h3 className="text-base font-semibold">No hay solicitudes para mostrar</h3>
              <p className="text-sm text-card-foreground/65">
                Prueba cambiando el filtro de estado o revisa más tarde.
              </p>
            </div>
          </div>
        </article>
      </section>
    );
  }

  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-end gap-2 h-full">
        <label htmlFor="status-filter" className="text-sm font-medium">
          Filtrar por estado:
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

      {accountRequests?.map((request) => (
        <StudentCourseRequestCard
          key={request.id}
          request={request}
          institute={institute}
          courseId={course_id}
        />
      ))}
    </section>
  );
}
