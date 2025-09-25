'use client';

import { useActionState } from "react";
import { CreateAccountAction } from "../actions/createAccountAction";
import BannerError from "@/shared/components/feedback/BannerError";

export default function CreateAccount() {
  const [state, dispatch, isLoading] = useActionState(CreateAccountAction, null);

  return (
    <>
      <form action={dispatch} className="flex flex-col items-center gap-4 w-full max-w-80 place-self-center">
        <input type="password" placeholder="Nueva contraseña" className="border p-2 rounded-lg" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg" disabled={isLoading}>Confirmar</button>
      </form>

      {state && !state.success && (
        <BannerError message={state.message || "Error al crear la cuenta."} />
      )}
    </>
  );
}