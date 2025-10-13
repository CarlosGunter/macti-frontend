export type AccountRequestPayload = {
  course_id: string;
};

export type AccountStatusPayload = {
  user_id: string;
  newStatus: "approved" | "rejected";
};
