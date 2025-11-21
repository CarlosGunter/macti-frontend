"use client";

import { useQuery } from "@tanstack/react-query";
import { useActionState, useState } from "react";
import Banner from "@/shared/components/feedback/Banner";
import Button from "@/shared/components/ui/Button";
import { institutes } from "@/shared/config/institutes";
import { useAutoDismissBanner } from "@/shared/hooks/useAutoDismissBanner";
import { fetchCourses } from "@/shared/services/fetchCourses";
import { accountRequestAction } from "../actions/accountRequestAction";

export default function AccountRequestForm({ institute }: { institute: string }) {
  const [state, dispatch, isLoading] = useActionState(accountRequestAction, null);
  const { success, message, data, errors } = state || {};

  const isBannerVisible = useAutoDismissBanner(message || null);

  const [selectedInstitute, setSelectedInstitute] = useState(
    institute || data?.institute || "",
  );

  const {
    data: courses,
    isLoading: coursesLoading,
    error: coursesError,
  } = useQuery({
    queryKey: ["courses", selectedInstitute],
    queryFn: async () => {
      const result = await fetchCourses({ institute: selectedInstitute });
      if (!result) throw new Error("No se pudieron cargar los cursos");
      return result;
    },
    enabled: !!selectedInstitute,
  });

  return (
    <>
      <form
        action={dispatch}
        className="flex flex-col gap-6 w-full max-w-80 place-self-center"
      >
        <label htmlFor="institute" className="grid gap-1.5">
          <span>Instituto*</span>

          <select
            name="institute"
            id="institute"
            value={selectedInstitute}
            onChange={(e) => setSelectedInstitute(e.target.value)}
          >
            <option value="">Selecciona un instituto</option>
            {Object.keys(institutes).map((key) => (
              <option key={key} value={key}>
                {institutes[key].name}
              </option>
            ))}
          </select>

          <span className="text-xs">
            Cada instituto tiene su propio proceso de solicitud.
          </span>
        </label>

        <label htmlFor="email" className="grid gap-1.5">
          <span>Correo electrónico*</span>

          <input
            type="email"
            id="email"
            name="email"
            className={`${Array.isArray(errors?.email?.errors) ? "border-red-500" : ""}`}
            defaultValue={data?.email || ""}
            placeholder="ejemplo@dominio.com"
            onChange={(e) => {
              e.target.value = e.target.value.toLowerCase();
            }}
          />

          {Array.isArray(errors?.email?.errors) ? (
            <span className="text-red-500 text-xs">{errors.email.errors[0]}</span>
          ) : (
            <span className="text-xs">Proporciona un correo electrónico válido.</span>
          )}
        </label>

        <label htmlFor="name" className="grid gap-1.5">
          <span>Nombre(s)*</span>

          <input
            type="text"
            id="name"
            name="name"
            className={`${Array.isArray(errors?.name?.errors) ? "border-red-500" : ""}`}
            defaultValue={data?.name || ""}
            placeholder="Juan"
          />

          {Array.isArray(errors?.name?.errors) ? (
            <span className="text-red-500 text-xs">{errors.name.errors[0]}</span>
          ) : (
            <span className="text-xs">Ingresa tu nombre o nombres.</span>
          )}
        </label>

        <label htmlFor="last_name" className="grid gap-1.5">
          <span>Apellidos*</span>

          <input
            type="text"
            id="last_name"
            name="last_name"
            className={`${Array.isArray(errors?.last_name?.errors) ? "border-red-500" : ""}`}
            defaultValue={data?.last_name || ""}
            placeholder="Pérez López"
          />

          {Array.isArray(errors?.last_name?.errors) ? (
            <span className="text-red-500 text-xs">{errors.last_name.errors[0]}</span>
          ) : (
            <span className="text-xs">Ingresa tus apellidos.</span>
          )}
        </label>

        <label htmlFor="course_id" className="grid gap-1.5">
          <span>Curso*</span>

          <select
            name="course_id"
            id="course_id"
            defaultValue={data?.course_id}
            className={`${Array.isArray(errors?.course_id?.errors) ? "border-red-500" : ""}`}
            disabled={!selectedInstitute || coursesLoading}
          >
            {coursesLoading ? (
              <option>Cargando cursos...</option>
            ) : coursesError ? (
              <option>Error al cargar cursos</option>
            ) : courses && courses.length > 0 ? (
              courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.displayname}
                </option>
              ))
            ) : (
              <option>No hay cursos disponibles</option>
            )}
          </select>

          {Array.isArray(errors?.course_id?.errors) ? (
            <span className="text-red-500 text-xs">{errors.course_id.errors[0]}</span>
          ) : (
            <span className="text-xs">
              Selecciona el curso al que deseas inscribirte.
            </span>
          )}
        </label>

        <Button type="submit" isLoading={isLoading}>
          <span>Solicitar</span>
        </Button>
      </form>

      {isBannerVisible && message && <Banner message={message} isError={!success} />}
    </>
  );
}
