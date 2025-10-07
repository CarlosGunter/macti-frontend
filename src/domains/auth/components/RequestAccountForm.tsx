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

        <label htmlFor="institute" className="grid gap-1">
          Instituto:
          <select name="institute" id="institute" defaultValue={institute || state?.data?.institute || ""} className="border p-2 rounded-lg bg-background/90" required>
            {Object.keys(institutes).map((key) => (
              <option key={key} value={key}>{institutes[key].name}</option>
            ))}
          </select>
        </label>

        <label htmlFor="email" className="grid gap-1">
          Email:
          <input type="email" id="email" name="email" required className="border p-2 rounded-lg" defaultValue={state?.data?.email || ""} />
        </label>
        
        <label htmlFor="name" className="grid gap-1">
          Nombre:
          <input type="text" id="name" name="name" required className="border p-2 rounded-lg" defaultValue={state?.data?.name || ""} />
        </label>

        <label htmlFor="last_name" className="grid gap-1">
          Apellido:
          <input type="text" id="last_name" name="last_name" required className="border p-2 rounded-lg" defaultValue={state?.data?.last_name || ""} />
        </label>
        
        {/* <label htmlFor="profesor">Profesor a cargo:</label>
        <input type="text" id="profesor" name="profesor" required className="border p-2 rounded-lg" defaultValue={state?.data?.profesor.toString() || ""} /> */}
        
        <label htmlFor="course_id" className="grid gap-1">
          Curso:
          <select name="course_id" id="course_id" defaultValue={state?.data?.course_id} className="border p-2 rounded-lg bg-background/90" required>
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