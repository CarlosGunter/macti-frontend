'use client';

import { useActionState } from "react";
import { requestAccountAction } from "../actions/requestAccountAction";
import Banner from "@/shared/components/feedback/Banner";
import { institutes } from "@/shared/config/institutes";

export default function RequestAccountForm({ institute }: { institute: string }) {
  const [state, dispatch, isLoading] = useActionState(requestAccountAction, null);

  return (
    <>
      <form action={dispatch} className="flex flex-col gap-6 w-full max-w-80 place-self-center">

        <label htmlFor="institute" className="grid gap-1.5">
          <span>Instituto*</span>
          <select name="institute" id="institute" defaultValue={institute || state?.data?.institute || ""} className="border p-2 rounded-lg bg-background/90 appearance-none" required>
            <optgroup label="Institutos">
              <hr />
              {Object.keys(institutes).map((key) => (
                <option key={key} value={key}>{institutes[key].name}</option>
              ))}
            </optgroup>
          </select>
          <span className="text-xs">Cada instituto tiene su propio proceso de solicitud.</span>
        </label>

        <label htmlFor="email" className="grid gap-1.5">
          <span>Correo electrónico*</span>
          <input type="email" id="email" name="email" required className="border p-2 rounded-lg" defaultValue={state?.data?.email || ""} placeholder="ejemplo@dominio.com" />
          <span className="text-xs">Proporciona un correo electrónico válido.</span>
        </label>
        
        <label htmlFor="name" className="grid gap-1.5">
          <span>Nombre*</span>
          <input type="text" id="name" name="name" required className="border p-2 rounded-lg" defaultValue={state?.data?.name || ""} placeholder="Juan" />
          <span className="text-xs">Ingresa tu nombre o nombres.</span>
        </label>

        <label htmlFor="last_name" className="grid gap-1.5">
          <span>Apellido*</span>
          <input type="text" id="last_name" name="last_name" required className="border p-2 rounded-lg" defaultValue={state?.data?.last_name || ""} placeholder="Pérez" />
          <span className="text-xs">Ingresa tu primer apellido.</span>
        </label>
        
        <label htmlFor="course_id" className="grid gap-1.5">
          <span>Curso*</span>
          <select name="course_id" id="course_id" defaultValue={state?.data?.course_id} className="border p-2 rounded-lg bg-background/90 appearance-none" required>
            <optgroup label={"Cursos del instituto seleccionado"}>
              <hr />  
              {Array.from({ length: 6 }, (_, i) => i).map((num) => (
                <option key={num} value={num} className="">Curso {num}</option>
              ))}
            </optgroup>
          </select>
          <span className="text-xs">Cada instituto tiene sus propios cursos.</span>
        </label>
        
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg mt-4" disabled={isLoading}>Solicitar</button>
      </form>

      {state && (
        <Banner message={state.message} />
      )}
    </>
  );
}