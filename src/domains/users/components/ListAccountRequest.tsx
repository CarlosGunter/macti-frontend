"use client";

import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import Banner from "@/shared/components/feedback/Banner";
import { STATUS_BADGE_LABELS, USER_STATUSES } from "../constants";
import { fetchAccountRequests } from "../services/fetchListAccountRequest";
import { useFilterStore } from "../stores/filterStore";
import type { UserStatus } from "../types";
import UserStatusUpdateCard from "./ui/UserAccountRequestCard";

interface AccountRequestListProps {
  course_id: string;
  institute: string;
}

export default function AccountRequestList({
  course_id,
  institute,
}: AccountRequestListProps) {
  const { statusFilter, setStatusFilter } = useFilterStore();

  const {
    data: accountRequests,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["accountRequests", course_id, institute, statusFilter],
    queryFn: async () => {
      return fetchAccountRequests({
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

      {accountRequests?.map((user) => (
        <UserStatusUpdateCard
          key={user.id}
          institute={institute}
          id={user.id}
          name={user.name}
          last_name={user.last_name}
          email={user.email}
          status={user.status}
          requestType="students"
        />
      ))}
    </section>
  );
}
