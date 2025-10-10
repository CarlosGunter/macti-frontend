"use client";

import Banner from "@/shared/components/feedback/Banner";
import UserStatusUpdateCard from "./UserAccountRequestCard";
import { useState } from "react";
import { Dispatch, SetStateAction } from "react";

type Account = {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
};
type AccountRequestsDataProps = {
  pending: Account[];
  approved: Account[];
  rejected: Account[];
};

interface AccountRequestListProps {
  accountRequests: {
    data: Account[];
    message?: string;
  };
};

const handleClick = (setList: Dispatch<SetStateAction<AccountRequestsDataProps>>) =>
  (id: string, status: 'pending' | 'approved' | 'rejected') => {
    setList((prevList) => ({
      ...prevList,
      [status]: prevList[status].filter((user) => user.id !== id),
    }));
  };

const groupByStatus = (data: Account[]) => {
  if (!data) return { pending: [], approved: [], rejected: []   };
  return Object.groupBy(data, account => account.status) as AccountRequestsDataProps;
}

export default function AccountRequestList({ accountRequests }: AccountRequestListProps) {

  if (!accountRequests || !accountRequests.data) {
    return (
      <Banner message={accountRequests?.message || "Ocurrió un error"} isError />
    );
  }

  const [list, setList] = useState(groupByStatus(accountRequests.data));

  if (list) {
    return (
      <section className="grid gap-8">
        <div className="grid gap-2">
          <h2 className="text-lg font-semibold">Pendientes:</h2>
          <div className="grid gap-4">
            {list && list.pending?.map((user: Account) => (
              <UserStatusUpdateCard
              key={`${user.id}-${list.pending?.length}`}
              name={user.name}
              email={user.email}
              status={user.status}
              userID={user.id}
              onDelete={handleClick(setList)}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Aprobadas:</h2>
          <div className="grid gap-4">
            {list && list.approved?.map((user: Account) => (
              <UserStatusUpdateCard
              key={`${user.id}-${list.approved?.length}`}
              name={user.name}
              email={user.email}
              status={user.status}
              userID={user.id}
              onDelete={handleClick(setList)}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Rechazadas:</h2>
          <div className="grid gap-4">
            {list && list.rejected?.map((user: Account) => (
              <UserStatusUpdateCard
              key={`${user.id}-${list.rejected?.length}`}
              name={user.name}
              email={user.email}
              status={user.status}
              userID={user.id}
              onDelete={handleClick(setList)}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }
}