'use client';

import { useActionState } from "react";
import { requestAccountAction } from "../actions/requestAccountAction";
import Banner from "@/shared/components/feedback/Banner";
import { institutes } from "@/shared/config/institutes";

export default function RequestAccountForm({ institute }: { institute: string }) {
  const [state, dispatch, isLoading] = useActionState(requestAccountAction, null);

  return (
    <>
      <form action={dispatch} className="flex flex-col gap-4 w-full max-w-80 place-self-center">

        <label htmlFor="instituto" className="grid gap-1">
          Instituto:
          <select name="instituto" id="instituto" defaultValue={institute || state?.data?.instituto.toString() || ""} className="border p-2 rounded-lg bg-background/90" required>
            {Object.keys(institutes).map((key) => (
              <option key={key} value={key}>{institutes[key].name}</option>
            ))}
          </select>
        </label>

        <label htmlFor="email" className="grid gap-1">
          Email:
          <input type="email" id="email" name="email" required className="border p-2 rounded-lg" defaultValue={state?.data?.email.toString() || ""} />
        </label>
        
        <label htmlFor="name" className="grid gap-1">
          Nombre:
          <input type="text" id="name" name="name" required className="border p-2 rounded-lg" defaultValue={state?.data?.name.toString() || ""} />
        </label>

        <label htmlFor="apellido" className="grid gap-1">
          Apellido:
          <input type="text" id="apellido" name="apellido" required className="border p-2 rounded-lg" defaultValue={state?.data?.apellido.toString() || ""} />
        </label>
        
        {/* <label htmlFor="profesor">Profesor a cargo:</label>
        <input type="text" id="profesor" name="profesor" required className="border p-2 rounded-lg" defaultValue={state?.data?.profesor.toString() || ""} /> */}
        
        <label htmlFor="curso" className="grid gap-1">
          Curso:
          <select name="curso" id="curso" defaultValue={state?.data?.curso.toString() || ""} className="border p-2 rounded-lg bg-background/90" required>
            {Array.from({ length: 6 }, (_, i) => i).map((num) => (
              <option key={num} value={num}>Curso {num}</option>
            ))}
          </select>
        </label>
        
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg mt-4" disabled={isLoading}>Solicitar</button>
      </form>

      {state && (
        <Banner message={state.message} />
      )}
    </>
  );
}