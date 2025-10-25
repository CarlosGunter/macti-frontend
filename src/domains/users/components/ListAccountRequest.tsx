"use client";

import { type Dispatch, type SetStateAction, useState } from "react";
import Banner from "@/shared/components/feedback/Banner";
import type { ListAccountsProps } from "../schemas/listAccountsSchema";
import UserStatusUpdateCard from "./UserAccountRequestCard";

interface AccountRequestListProps {
  accountRequests: ListAccountsProps | undefined;
}

type ListByStatus = Record<ListAccountsProps[number]["status"], ListAccountsProps>;
const handleClick =
  (setList: Dispatch<SetStateAction<ListByStatus>>) =>
  (id: number, status: keyof ListByStatus) => {
    setList((prevList) => ({
      ...prevList,
      [status]: prevList[status].filter((user) => user.id !== id),
    }));
  };

const groupByStatus = (data: ListAccountsProps | undefined) => {
  if (!data) return { pending: [], approved: [], rejected: [], created: [] };
  return Object.groupBy(data, (account) => account.status) as ListByStatus;
};

export default function AccountRequestList({ accountRequests }: AccountRequestListProps) {
  const [list, setList] = useState(groupByStatus(accountRequests));

  if (!accountRequests) {
    return <Banner message="Ocurrió un error al cargar las solicitudes" isError />;
  }

  if (list) {
    return (
      <section className="grid gap-8">
        <div className="grid gap-2">
          <h2 className="text-lg font-semibold">Pendientes:</h2>
          <div className="grid gap-4">
            {list?.pending?.map((user) => (
              <UserStatusUpdateCard
                key={`${user.id}-${list.pending?.length}`}
                id={user.id}
                name={user.name}
                last_name={user.last_name}
                email={user.email}
                status={user.status}
                onDelete={handleClick(setList)}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Aprobadas:</h2>
          <div className="grid gap-4">
            {list?.approved?.map((user) => (
              <UserStatusUpdateCard
                key={`${user.id}-${list.approved?.length}`}
                id={user.id}
                name={user.name}
                last_name={user.last_name}
                email={user.email}
                status={user.status}
                onDelete={handleClick(setList)}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Rechazadas:</h2>
          <div className="grid gap-4">
            {list?.rejected?.map((user) => (
              <UserStatusUpdateCard
                key={`${user.id}-${list.rejected?.length}`}
                id={user.id}
                name={user.name}
                last_name={user.last_name}
                email={user.email}
                status={user.status}
                onDelete={handleClick(setList)}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }
}
