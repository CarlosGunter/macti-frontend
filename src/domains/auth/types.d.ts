export type AccountRequestPayload = {
  email: string;
  name: string;
  apellido: string;
  profesor: string;
  curso: string;
  institute: string;
};

export type CreateAccountPayload = {
  id: string;
  password: string;
};