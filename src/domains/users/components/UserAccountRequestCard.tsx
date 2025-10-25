"use client";

import Button from "@/shared/components/ui/Button";
import { useAccountStatus } from "../hooks/useAccountStatus";
import type { ListAccountsProps } from "../schemas/listAccountsSchema";

type UserType = ListAccountsProps[number];
interface UserStatusUpdateCardProps extends UserType {
  onDelete: (id: number, status: ListAccountsProps[number]["status"]) => void;
}

export default function UserStatusUpdateCard({
  id,
  name,
  last_name,
  email,
  status,
  onDelete,
}: UserStatusUpdateCardProps) {
  const { isPending, handleNewStatus, isDeleted, animateDelete } = useAccountStatus();

  return (
    <article
      className={`flex justify-between items-center w-full p-4 border rounded-lg shadow gap-2 transition-all ${isDeleted ? "opacity-0" : "opacity-100"} ${isDeleted ? "scale-y-130" : "scale-y-100"}`}
    >
      <div>
        <h1 className="text-sm">{`${name} ${last_name}`}</h1>
        <p className="text-xs">{email}</p>
      </div>

      <div className="flex gap-2 items-center">
        <Button
          onClick={() => {
            handleNewStatus({ user_id: id, newStatus: "approved" });
            animateDelete(onDelete, id, status);
          }}
          variant="recommended"
          isLoading={isPending}
        >
          <span>Aprobar</span>
        </Button>

        <Button
          onClick={() => {
            handleNewStatus({ user_id: id, newStatus: "rejected" });
            animateDelete(onDelete, id, status);
          }}
          variant="danger"
          isLoading={isPending}
        >
          <span>Rechazar</span>
        </Button>
      </div>
    </article>
  );
}
