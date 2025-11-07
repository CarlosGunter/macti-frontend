"use client";

import Keycloak from "keycloak-js";
import { useParams } from "next/navigation";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { keycloakConfigs } from "@/shared/config/kcConfig";
import { tryCatch } from "@/shared/utils/try-catch";

type AuthContextType = {
  authenticated: boolean;
  token?: string;
  login: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  login: async () => {},
  logout: () => {},
});

interface LoginProviderProps {
  children: React.ReactNode;
  institute?: string;
}

export function LoginProvider({
  children,
  institute: propInstitute,
}: LoginProviderProps) {
  const { institute: paramInstitute } = useParams();
  // Esto permite usar el provider tanto con prop como en rutas dinámicas
  const institute = propInstitute || paramInstitute;

  const [authenticated, setAuthenticated] = useState(false);
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);

  // biome-ignore lint: false positive
  useEffect(() => {
    initializeKeycloak();

    setAuthenticated(() => {
      const jwtKc = sessionStorage.getItem("token");
      if (!jwtKc) return false;

      // Verificar si el token no ha expirado
      const payload = JSON.parse(atob(jwtKc.split(".")[1]));
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      return now < exp;
    });
  }, [institute]);

  const initializeKeycloak = async () => {
    if (!institute) return null;

    const cfg = keycloakConfigs[institute as string];
    if (!cfg) {
      console.error(`No hay configuración para el instituto ${institute}`);
      return null;
    }

    const kc = new Keycloak(cfg);
    setKeycloak(kc);

    const { data: _auth, error } = await tryCatch(
      kc.init({
        checkLoginIframe: false,
        redirectUri: `${window.location.origin}/${institute}`,
      }),
    );
    if (error) {
      console.error("Error al inicializar Keycloak", error);
      return null;
    }

    try {
      if (kc.token) sessionStorage.setItem("token", kc.token);
    } catch (e) {
      console.error("No se pudo guardar el token en sessionStorage", e);
    }

    return kc;
  };

  const login = async () => {
    if (keycloak) await keycloak.login();

    const kc = await initializeKeycloak();
    if (kc) await kc.login();

    return;
  };

  const logout = () => keycloak?.logout();

  return (
    <AuthContext.Provider
      value={{ authenticated, token: keycloak?.token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useLogin = () => useContext(AuthContext);
