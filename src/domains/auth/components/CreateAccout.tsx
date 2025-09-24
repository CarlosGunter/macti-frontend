'use client';

import { useActionState } from "react";
import { CreateAccountAction } from "../actions/createAccountAction";

export default function CreateAccount() {
  const [state, dispatch, isLoading] = useActionState(CreateAccountAction, null);

  return (
    <form action={dispatch} className="flex flex-col gap-4">
      <input type="password" placeholder="Nueva contraseña" className="border p-2 rounded-lg" />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg" disabled={isLoading}>Confirmar</button>
    </form>
  );
}