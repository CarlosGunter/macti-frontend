'use client';

import { useActionState } from "react";
import { requestAccountAction } from "../actions/request-account.action";

export default function RequestAccountForm() {
  const [state, dispatch, isLoading] = useActionState(requestAccountAction, null);

  return (
    <form action={dispatch} className="flex flex-col gap-4">
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required className="border p-2 rounded-lg" defaultValue={state?.data?.email.toString() || ""} />

        <label htmlFor="name">Nombre:</label>
        <input type="text" id="name" name="name" required className="border p-2 rounded-lg" defaultValue={state?.data?.name.toString() || ""} />

        <label htmlFor="apellido">Apellido:</label>
        <input type="text" id="apellido" name="apellido" required className="border p-2 rounded-lg" defaultValue={state?.data?.apellido.toString() || ""} />

        <label htmlFor="profesor">Profesor a cargo:</label>
        <input type="text" id="profesor" name="profesor" required className="border p-2 rounded-lg" defaultValue={state?.data?.profesor.toString() || ""} />

        <label htmlFor="curso">Curso:</label>
        <input type="text" id="curso" name="curso" required className="border p-2 rounded-lg" defaultValue={state?.data?.curso.toString() || ""} />

        <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg" disabled={isLoading}>Solicitar</button>
      </form>
  );
}