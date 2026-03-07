"use client";

import { useQueryClient } from "@tanstack/react-query";
import Button from "@/shared/components/ui/Button";
import { STATUS_BADGE_LABELS, STATUS_BTN_LABELS, USER_STATUSES } from "../../constants";
import { useAccountStatus } from "../../hooks/useAccountStatus";
import type { ListAccountsProps } from "../../schemas/listAccountsSchema";

type UserType = ListAccountsProps[number];
interface UserStatusUpdateCardProps extends UserType {
  requestType?: "students" | "teachers";
}

export default function UserStatusUpdateCard({
  id,
  name,
  last_name,
  email,
  status,
  requestType = "students",
}: UserStatusUpdateCardProps) {
  const queryClient = useQueryClient();
  const { isPending, updateStatus } = useAccountStatus();

  const invalidateQueries = () => {
    const queryKey =
      requestType === "teachers" ? ["accountRequestsTeachers"] : ["accountRequests"];
    queryClient.invalidateQueries({ queryKey });
  };

  return (
    <article className="flex flex-col gap-4 min-w-full p-4 border border-border bg-card text-card-foreground rounded-lg transition-all md:flex-row md:items-center md:justify-between">
      <div className="flex place-items-center gap-2 md:gap-4 w-full md:w-auto">
        <div className="flex flex-col gap-1 wrap-anywhere">
          <h1 className="text-lg font-semibold">{`${name} ${last_name}`}</h1>
          <p className="text-sm text-card-foreground/70">{email}</p>
        </div>
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary text-primary-foreground">
          {STATUS_BADGE_LABELS[status]}
        </span>
      </div>

      <div className="flex gap-2 items-center">
        {status === USER_STATUSES.CREATED ? (
          <Button
            onClick={() => {
              updateStatus({
                user_id: id,
                newStatus: USER_STATUSES.REJECTED,
                onSuccess: invalidateQueries,
              });
            }}
            isLoading={isPending}
            variant="danger"
            className="text-sm md:text-base"
          >
            <span>Eliminar</span>
          </Button>
        ) : (
          Object.values(USER_STATUSES)
            .filter(
              (userStatus) =>
                userStatus !== USER_STATUSES.CREATED && userStatus !== status,
            )
            .map((userStatus) => (
              <Button
                key={userStatus}
                onClick={() => {
                  updateStatus({
                    user_id: id,
                    newStatus: userStatus,
                    onSuccess: invalidateQueries,
                  });
                }}
                isLoading={isPending}
                variant={
                  userStatus === USER_STATUSES.APPROVED ? "recommended" : "default"
                }
                className="text-sm md:text-base"
              >
                <span>
                  {STATUS_BTN_LABELS[userStatus as keyof typeof STATUS_BTN_LABELS]}
                </span>
              </Button>
            ))
        )}
      </div>
    </article>
  );
}
