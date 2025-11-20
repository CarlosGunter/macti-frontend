import type { USER_STATUSES } from "./constants";

export type UserStatus = (typeof USER_STATUSES)[keyof typeof USER_STATUSES];

export type AccountRequestPayload = {
  course_id: string;
  institute: string;
  status?: UserStatus;
};

export type AccountStatusPayload = {
  user_id: number;
  newStatus: UserStatus;
};
