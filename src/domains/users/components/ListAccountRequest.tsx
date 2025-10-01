"use client";

import BannerError from "@/shared/components/feedback/BannerError";
import UserReqAccountCard from "./UserReqAccountCard";
import { useState } from "react";
import { Dispatch, SetStateAction } from "react";

type AccountRequestsDataProps = {
  id: string;
  name: string;
  email: string;
};

interface ListAccountRequestProps {
  accountRequests: Record<string, any>;
};

const handleClick = (setList: Dispatch<SetStateAction<AccountRequestsDataProps[]>>) =>
  (id: string) => {
    setList((prevList) => prevList.filter((user) => user.id !== id));
  };

export default function ListAccountRequest({ accountRequests }: ListAccountRequestProps) {

  if (!accountRequests.data) {
    return (
      <BannerError message={accountRequests.message} />
    );
  }

  const [list, setList] = useState(accountRequests.data as AccountRequestsDataProps[]);

  if (list && list.length > 0) {
    return (
      <>
        {list.map((user: Record<string, any>) => (
          <UserReqAccountCard
          key={`${user.id}-${list.length}`}
          name={user.name}
          email={user.email}
          userID={user.id}
          onDelete={handleClick(setList)}
          />
        ))}
      </>
    );
  }
}