"use client";

import Form from "next/form";
import { useActionState, useState } from "react";
import VisibilityIcon from "@/assets/svg/visibility";
import VisibilityOffIcon from "@/assets/svg/visibilityOff";
import { Button } from "@/shared/shadcn/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/shared/shadcn/components/ui/field";
import { Input } from "@/shared/shadcn/components/ui/input";
import { createAccountAction } from "../actions/createAccountAction";
import type { CreateAccountResponse } from "../schemas/createAccountSchema";

export default function CreateAccount({ userData }: { userData: CreateAccountResponse }) {
  const [state, formAction, isPending] = useActionState(createAccountAction, null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisiblePass, setIsVisiblePass] = useState(false);
  const [isVisibleConfirmPass, setIsVisibleConfirmPass] = useState(false);

  const passwordsMatch = password === confirmPassword || confirmPassword === "";

  return (
    <Form action={formAction} disabled={isPending}>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Crear Cuenta</FieldLegend>
          <FieldDescription>
            Establece una contraseña segura para tu cuenta.
          </FieldDescription>

          <input type="hidden" name="user_id" defaultValue={userData.id} />

          <FieldGroup>
            <Field>
              <FieldLabel>Nueva Contraseña</FieldLabel>
              <FieldContent>
                <div className="relative">
                  <Input
                    name="new_password"
                    type={isVisiblePass ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    defaultValue={state?.data?.new_password as string}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setIsVisiblePass(!isVisiblePass)}
                    tabIndex={-1}
                  >
                    {isVisiblePass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </button>
                </div>
              </FieldContent>
              <FieldDescription>Ingresa una contraseña segura.</FieldDescription>
              <FieldError>{state?.errors.new_password?.errors[0]}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Confirmar Contraseña</FieldLabel>
              <FieldContent>
                <div className="relative">
                  <Input
                    name="confirm_password"
                    type={isVisibleConfirmPass ? "text" : "password"}
                    placeholder="Confirma tu contraseña"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setIsVisibleConfirmPass(!isVisibleConfirmPass)}
                    tabIndex={-1}
                  >
                    {isVisibleConfirmPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </button>
                </div>
              </FieldContent>
              <FieldError>
                {!passwordsMatch
                  ? "Las contraseñas no coinciden."
                  : state?.errors.confirm_password?.errors[0]}
              </FieldError>
            </Field>

            {state?.errors.general && (
              <FieldError>{state.errors.general.errors[0]}</FieldError>
            )}

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </FieldGroup>
        </FieldSet>
      </FieldGroup>
    </Form>
  );
}
