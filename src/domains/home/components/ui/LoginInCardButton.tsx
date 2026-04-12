"use client";

import type { InstitutesType } from "@/shared/config/institutes";
import { getAuthClient } from "@/shared/lib/auth-client";

export function LoginCardButton({ institute }: { institute: InstitutesType }) {
  const authClient = getAuthClient(institute);

  return (
    <button
      type="button"
      className="px-4 py-2 rounded-sm bg-black/40 hover:bg-black/70 active:bg-black/90 transition-colors duration-200 cursor-pointer pointer-events-auto"
      onClick={(e) => {
        e.preventDefault();
        authClient.signIn.oauth2({
          providerId: "keycloak",
          callbackURL: `/${institute}/perfil`,
        });
      }}
    >
      Iniciar sesión
    </button>
  );
}
