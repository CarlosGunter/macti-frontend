export type FieldsListAccountRequest = {
  course_id: string;
};

export type UserStatusChangeParams = {
  user_id: string;
  newStatus: 'approved' | 'rejected';
}