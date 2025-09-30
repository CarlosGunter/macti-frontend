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
  accountRequests: {
    success: boolean;
    message: string;
    data?: undefined;
  } | {
    success: boolean;
    data: AccountRequestsDataProps[];
    message?: undefined;
  };
};

const handleClick = (setList: Dispatch<SetStateAction<AccountRequestsDataProps[]>>) => (id: string) => {
  setList((prevList) => prevList.filter((user) => user.id !== id));
};

export default function ListAccountRequest({ accountRequests }: ListAccountRequestProps) {

  const [list, setList] = useState(accountRequests.data);

  if (!accountRequests.success && accountRequests.message) {
    return (
      <BannerError message={accountRequests.message} />
    );
  }

  if (list.length > 0) {
    return (
      <>
        {list.map((user: Record<string, any>) => (
          <UserReqAccountCard key={`${user.id}-${list.length}`} name={user.name} email={user.email} userID={user.id} onDelete={handleClick(setList)} />
        ))}
      </>
    );
  }
}