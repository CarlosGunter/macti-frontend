"use client";

import { useQueryClient } from "@tanstack/react-query";
import Button from "@/shared/components/ui/Button";
import { STATUS_BTN_LABELS, USER_ROLES, USER_STATUSES } from "../../constants";
import { useRequestStatus } from "../../hooks/useRequestStatus";
import type { UserStatus } from "../../types";

type AllowedAction = {
  status: UserStatus;
  variant: "recommended" | "danger" | "default";
};

const ALLOWED_TRANSITIONS: Record<UserStatus, AllowedAction[]> = {
  [USER_STATUSES.PENDING]: [
    { status: USER_STATUSES.APPROVED, variant: "recommended" },
    { status: USER_STATUSES.REJECTED, variant: "danger" },
  ],
  [USER_STATUSES.APPROVED]: [{ status: USER_STATUSES.REJECTED, variant: "danger" }],
  [USER_STATUSES.REJECTED]: [
    { status: USER_STATUSES.PENDING, variant: "default" },
    { status: USER_STATUSES.APPROVED, variant: "recommended" },
  ],
  [USER_STATUSES.CREATED]: [{ status: USER_STATUSES.REJECTED, variant: "danger" }],
};

interface TeacherCourseRequestStatusActionsProps {
  institute: string;
  requestId: number;
  currentStatus: UserStatus;
}

export default function TeacherCourseRequestStatusActions({
  institute,
  requestId,
  currentStatus,
}: TeacherCourseRequestStatusActionsProps) {
  const queryClient = useQueryClient();
  const { isPending, updateStatus, error } = useRequestStatus();

  const actions = ALLOWED_TRANSITIONS[currentStatus];

  const invalidateRequests = () => {
    queryClient.invalidateQueries({ queryKey: ["courseRequestsTeachers", institute] });
  };

  return (
    <section aria-labelledby="teacher-request-actions" className="grid gap-2">
      <h4
        id="teacher-request-actions"
        className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-card-foreground/45"
      >
        Acciones
      </h4>

      <ul
        className="flex flex-wrap gap-2"
        aria-label="Acciones disponibles para la solicitud"
      >
        {actions.map(({ status, variant }) => (
          <li key={status}>
            <Button
              onClick={() => {
                updateStatus({
                  institute,
                  request_id: requestId,
                  newStatus: status,
                  role: USER_ROLES.TEACHER,
                  onSuccess: invalidateRequests,
                });
              }}
              isLoading={isPending}
              variant={variant}
            >
              {STATUS_BTN_LABELS[status]}
            </Button>
          </li>
        ))}
      </ul>

      {error && <p className="px-1 text-xs text-red-700 dark:text-red-300">{error}</p>}

      {isPending && (
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-card-foreground/45">
          Actualizando...
        </p>
      )}
    </section>
  );
}
