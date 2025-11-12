"use client";

import { useActionState, useState } from "react";
import VisibilityIcon from "@/assets/svg/visibility";
import VisibilityOffIcon from "@/assets/svg/visibilityOff";
import Banner from "@/shared/components/feedback/Banner";
import Button from "@/shared/components/ui/Button";
import { createAccountAction } from "../actions/createAccountAction";
import type { CreateAccountResponse } from "../schemas/createAccountSchema";

export default function CreateAccount({ userData }: { userData: CreateAccountResponse }) {
  const [state, dispatch, isLoading] = useActionState(createAccountAction, null);

  const [password, setPassword] = useState(state?.data?.new_password || "");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisiblePass, setIsVisiblePass] = useState(false);
  const [isVisibleConfirmPass, setIsVisibleConfirmPass] = useState(false);

  const passwordsMatch = password === confirmPassword;

  return (
    <>
      <form
        action={dispatch}
        className="flex flex-col items-center gap-6 w-full max-w-80 place-self-center"
      >
        <input type="hidden" name="user_id" defaultValue={userData.id} />

        <label htmlFor="new_password" className="grid gap-1.5 w-full">
          <span>Ingresa una nueva contraseña*</span>
          <div className="grid place-items-center">
            <input
              name="new_password"
              type={isVisiblePass ? "text" : "password"}
              placeholder="Nueva contraseña"
              className={`col-start-1 col-end-1 row-start-1 -row-end-1 w-full ${!passwordsMatch && confirmPassword ? "border-red-500" : "border-none"}`}
              defaultValue={state?.data?.new_password || ""}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="col-start-1 -col-end-1 row-start-1 -row-end-1 place-self-end self-center px-2 py-1.5"
              onClick={() => setIsVisiblePass(!isVisiblePass)}
            >
              {isVisiblePass ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </button>
          </div>
          <span className="text-xs">Ingresa una contraseña segura.</span>
        </label>

        <label htmlFor="confirm_password" className="grid gap-1.5 w-full">
          <span>Confirma tu nueva contraseña*</span>
          <div className="grid place-items-center">
            <input
              name="confirm_password"
              type={isVisibleConfirmPass ? "text" : "password"}
              placeholder="Confirma tu nueva contraseña"
              className={`col-start-1 col-end-1 row-start-1 -row-end-1 w-full ${!passwordsMatch && confirmPassword ? "border-red-500" : "border-none"}`}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="col-start-1 -col-end-1 row-start-1 -row-end-1 place-self-end self-center px-2 py-1.5"
              onClick={() => setIsVisibleConfirmPass(!isVisibleConfirmPass)}
            >
              {isVisibleConfirmPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </button>
          </div>

          {!passwordsMatch && confirmPassword && (
            <span className="text-xs text-red-500">Las contraseñas no coinciden.</span>
          )}
        </label>

        <Button type="submit" className="w-full" isLoading={isLoading}>
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
