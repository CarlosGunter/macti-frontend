'use client';

import { useNewStatus } from "../hooks/useNewStatus";

interface UserReqAccountCardProps {
  name: string;
  email: string;
}

export default function UserReqAccountCard({ name, email }: UserReqAccountCardProps) {
  const { isPending, handleNewStatus,  error } = useNewStatus();

  return (
    <section className="flex justify-between items-center w-full p-4 border rounded-lg shadow gap-2">
      <div>
        <h1 className="text-sm">{name}</h1>
        <p className="text-xs">{email}</p>
      </div>

      <div className="flex gap-2 items-center">
        <button
        onClick={() => handleNewStatus(
          { user_id: email, newStatus: 'approved' }
        )}
        className="p-2 bg-green-500 text-white text-sm rounded"
        disabled={isPending}>
          Aprobar
        </button>
        
        <button
        onClick={() => handleNewStatus(
          { user_id: email, newStatus: 'rejected' }
        )}
        className="p-2 bg-red-500 text-white text-sm rounded"
        disabled={isPending}>
          Rechazar
        </button>
      </div>
    </section>
  );
}