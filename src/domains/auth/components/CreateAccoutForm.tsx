"use client";

import { useActionState, useState } from "react";
import Banner from "@/shared/components/feedback/Banner";
import Button from "@/shared/components/ui/Button";
import { createAccountAction } from "../actions/createAccountAction";

export default function CreateAccount({
  userData,
}: {
  userData: Record<string, string>;
}) {
  const [state, dispatch, isLoading] = useActionState(createAccountAction, null);

  const [password, setPassword] = useState(state?.data?.password || "");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordsMatch = password === confirmPassword;

  return (
    <>
      <form
        action={dispatch}
        className="flex flex-col items-center gap-6 w-full max-w-80 place-self-center"
      >
        <input type="hidden" name="id" defaultValue={userData.id} />

        <label htmlFor="password" className="grid gap-1.5 w-full">
          <span>Ingresa una nueva contraseña*</span>
          <input
            name="password"
            type="password"
            placeholder="Nueva contraseña"
            className={`${!passwordsMatch && confirmPassword ? "border-red-500" : ""}`}
            defaultValue={state?.data?.password || ""}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="text-xs">Ingresa una contraseña segura.</span>
        </label>

        <label htmlFor="confirm_password" className="grid gap-1.5 w-full">
          <span>Confirma tu nueva contraseña*</span>
          <input
            name="confirm_password"
            type="password"
            placeholder="Confirma tu nueva contraseña"
            className={`${!passwordsMatch && confirmPassword ? "border-red-500" : ""}`}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {!passwordsMatch && confirmPassword && (
            <span className="text-xs text-red-500">Las contraseñas no coinciden.</span>
          )}
        </label>

        <Button
          type="submit"
          className="w-full flex gap-2 justify-center items-center"
          isLoading={isLoading}
        >
          <span>Crear cuenta</span>
        </Button>
      </form>

      {state && (
        <Banner
          message={state.message || "Error al crear la cuenta."}
          isError={!state.message}
        />
      )}
    </>
  );
}
