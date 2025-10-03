'use client';

import { useNewStatus } from "../hooks/useNewStatus";

interface UserReqAccountCardProps {
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  userID: string;
  onDelete: (id: string, status: 'pending' | 'approved' | 'rejected') => void;
}

export default function UserReqAccountCard({ name, email, status, userID, onDelete }: UserReqAccountCardProps) {
  const {
    isPending,
    handleNewStatus,
    error,
    isDeleted,
    animateDelete
  } = useNewStatus();

  return (
    <article className={`flex justify-between items-center w-full p-4 border rounded-lg shadow gap-2 transition-all ${isDeleted ? 'opacity-0' : 'opacity-100'} ${isDeleted ? 'scale-y-130' : 'scale-y-100'}`}>
      <div>
        <h1 className="text-sm">{name}</h1>
        <p className="text-xs">{email}</p>
      </div>

      <div className="flex gap-2 items-center">
        <button
        onClick={() => {
          handleNewStatus({ user_id: userID, newStatus: 'approved' });
          animateDelete(onDelete, userID, status);
        }}
        className="p-2 bg-green-500 text-white text-sm rounded"
        disabled={isPending}>
          Aprobar
        </button>
        
        <button
        onClick={() => {
          handleNewStatus({ user_id: userID, newStatus: 'rejected' });
          animateDelete(onDelete, userID, status);
        }}
        className="p-2 bg-red-500 text-white text-sm rounded"
        disabled={isPending}>
          Rechazar
        </button>
      </div>
    </article>
  );
}