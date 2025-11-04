"use client";

import { type Dispatch, type SetStateAction, useState } from "react";
import Banner from "@/shared/components/feedback/Banner";
import type { ListAccountsProps } from "../schemas/listAccountsSchema";
import type { UserStatus } from "../types";
import UserStatusUpdateCard from "./UserAccountRequestCard";

interface AccountRequestListProps {
  accountRequests: ListAccountsProps | undefined;
}

const handleClick =
  (setList: Dispatch<SetStateAction<ListAccountsProps | undefined>>) =>
  (id: number, status: UserStatus) => {
    setList((prevList) =>
      prevList?.map((user) => (user.id === id ? { ...user, status } : user)),
    );
  };

export default function AccountRequestList({ accountRequests }: AccountRequestListProps) {
  const [list, setList] = useState(accountRequests);

  if (!accountRequests) {
    return <Banner message="Ocurrió un error al cargar las solicitudes" isError />;
  }

  if (list) {
    return (
      <section className="grid gap-4">
        {list?.map((user) => (
          <UserStatusUpdateCard
            key={`${user.id}-${list.length}`}
            id={user.id}
            name={user.name}
            last_name={user.last_name}
            email={user.email}
            status={user.status}
            handleChangeStatus={handleClick(setList)}
          />
        ))}
      </section>
    );
  }
}
