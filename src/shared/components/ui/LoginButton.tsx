"use client";

import { getAuthClient } from "@/shared/lib/auth-client";
import Button from "./Button";

export function LoginButton({ institute }: { institute: string }) {
  return (
    <Button
      type="button"
      onClick={async () => {
        const authClient = getAuthClient(institute);
        await authClient.signIn.oauth2({
          providerId: "keycloak",
          callbackURL: `/${institute}/perfil`,
        });
      }}
    >
      Iniciar sesión
    </Button>
  );
}
