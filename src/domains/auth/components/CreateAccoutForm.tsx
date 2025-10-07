'use client';

import { useActionState } from "react";
import { createAccountAction } from "../actions/createAccountAction";
import Banner from "@/shared/components/feedback/Banner";

export default function CreateAccount({ userData }: { userData: Record<string, any> }) {
  const [state, dispatch, isLoading] = useActionState(createAccountAction, null);

  return (
    <>
      <form action={dispatch} className="flex flex-col items-center gap-4 w-full max-w-80 place-self-center">
        <input type="hidden" name='id' defaultValue={userData.id} />
        <input name="password" type="password" placeholder="Nueva contraseña" className="border p-2 rounded-lg" defaultValue={state?.data?.password || ''} />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg" disabled={isLoading}>Confirmar</button>
      </form>

      {state && (
        <Banner message={state.message || "Error al crear la cuenta."} />
      )}
    </>
  );
}