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
    <article className="flex justify-between items-center w-full p-4 border rounded-lg shadow gap-2 transition-all">
      <div className="flex place-items-center gap-4">
        <div>
          <h1 className="text-sm">{`${name} ${last_name}`}</h1>
          <p className="text-xs">{email}</p>
        </div>
        <span className="px-2 py-1 text-xs font-medium bg-accent text-black rounded-full">
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
