export type AccountRequestPayload = {
  course_id: string;
};

export type AccountStatusPayload = {
  user_id: number;
  newStatus: "approved" | "rejected";
};
