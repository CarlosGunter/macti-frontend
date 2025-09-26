import BannerError from "@/shared/components/feedback/BannerError";
import { getListAccountRequest } from "../services/getListAccountRequest";
import { FieldsListAccountRequest } from "../types";
import UserReqAccountCard from "./UserReqAccountCard";

export default async function ListAccountRequest({ course_id }: FieldsListAccountRequest) {
  const listAccountRequests = await getListAccountRequest({ course_id });

  if (!listAccountRequests.success && listAccountRequests.message) {
    return (
      <BannerError message={listAccountRequests.message} />
    );
  }

  if (listAccountRequests.data.length > 0) {
    return (
      <>
        {listAccountRequests.data.map((user: Record<string, any>) => (
          <UserReqAccountCard key={user.id} name={user.name} email={user.email} userID={user.id} />
        ))}
      </>
    );
  }
}