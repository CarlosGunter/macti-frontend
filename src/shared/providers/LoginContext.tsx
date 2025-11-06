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

  const initializeKeycloak = async () => {
    if (!institute) return null;

    const cfg = keycloakConfigs[institute as string];
    if (!cfg) {
      console.error(`No hay configuración para el instituto ${institute}`);
      return null;
    }

    const kc = new Keycloak(cfg);
    setKeycloak(kc);

    const { data: auth, error } = await tryCatch(kc.init({ checkLoginIframe: false }));

    if (error) {
      console.error("Error al inicializar Keycloak", error);
      return null;
    }

    try {
      if (kc.token) localStorage.setItem("token", kc.token);
    } catch (e) {
      console.error("No se pudo guardar el token en localStorage", e);
    }

    setAuthenticated(auth);

    try {
      const kcAny = kc as unknown as {
        onAuthSuccess?: () => void;
        onAuthLogout?: () => void;
      };
      kcAny.onAuthSuccess = () => setAuthenticated(true);
      kcAny.onAuthLogout = () => setAuthenticated(false);
    } catch {
      console.error("No se pudieron asignar los manejadores de eventos");
    }

    return kc;
  };

  const login = async () => {
    if (!keycloak) {
      const kc = await initializeKeycloak();

      if (kc) await kc.login();
      return;
    }

    await keycloak.login();
  };

  const logout = () => keycloak?.logout();

  // biome-ignore lint: false positive
  useEffect(() => {
    initializeKeycloak();
  }, []);

  return (
    <AuthContext.Provider
      value={{ authenticated, token: keycloak?.token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useLogin = () => useContext(AuthContext);
