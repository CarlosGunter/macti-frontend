"use client";

import Button from "@/shared/components/ui/Button";
import { useAccountStatus } from "../hooks/useAccountStatus";

interface UserStatusUpdateCardProps {
  name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  userID: string;
  onDelete: (id: string, status: "pending" | "approved" | "rejected") => void;
}

export default function UserStatusUpdateCard({
  name,
  email,
  status,
  userID,
  onDelete,
}: UserStatusUpdateCardProps) {
  const { isPending, handleNewStatus, isDeleted, animateDelete } = useAccountStatus();

  return (
    <article
      className={`flex justify-between items-center w-full p-4 border rounded-lg shadow gap-2 transition-all ${isDeleted ? "opacity-0" : "opacity-100"} ${isDeleted ? "scale-y-130" : "scale-y-100"}`}
    >
      <div>
        <h1 className="text-sm">{name}</h1>
        <p className="text-xs">{email}</p>
      </div>

      <div className="flex gap-2 items-center">
        <Button
          onClick={() => {
            handleNewStatus({ user_id: userID, newStatus: "approved" });
            animateDelete(onDelete, userID, status);
          }}
          variant="recommended"
          disabled={isPending}
        >
          Aprobar
        </Button>

        <Button
          onClick={() => {
            handleNewStatus({ user_id: userID, newStatus: "rejected" });
            animateDelete(onDelete, userID, status);
          }}
          variant="danger"
          disabled={isPending}
        >
          Rechazar
        </Button>
      </div>
    </article>
  );
}
