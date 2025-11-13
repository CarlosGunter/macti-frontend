"use client";

import Keycloak from "keycloak-js";
import { useParams } from "next/navigation";
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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
  const institute = propInstitute || (paramInstitute as string);
  const keycloak = useMemo(
    () => new Keycloak(keycloakConfigs[institute] || keycloakConfigs.principal),
    [institute],
  );

  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState<string | undefined>();

  const updateStoredToken = useCallback((kcToken?: string | null) => {
    if (!kcToken) {
      setToken(undefined);
      try {
        sessionStorage.removeItem("token");
      } catch (error) {
        console.error("No se pudo limpiar el token en sessionStorage", error);
      }
      return;
    }

    setToken(kcToken);
    try {
      sessionStorage.setItem("token", kcToken);
    } catch (error) {
      console.error("No se pudo guardar el token en sessionStorage", error);
    }
  }, []);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (!storedToken) {
      setAuthenticated(false);
      setToken(undefined);
      return;
    }

    try {
      const [, payloadBase64] = storedToken.split(".");
      const payload = JSON.parse(atob(payloadBase64));
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      if (!exp || now >= exp) {
        updateStoredToken(null);
        setAuthenticated(false);
        return;
      }

      setToken(storedToken);
      setAuthenticated(true);
    } catch (error) {
      console.error("No se pudo validar el token almacenado", error);
      updateStoredToken(null);
      setAuthenticated(false);
    }
  }, [updateStoredToken]);

  const initializeKeycloak = useCallback(async () => {
    if (!institute) return null;

    const { data: auth, error } = await tryCatch(
      keycloak.init({
        checkLoginIframe: false,
        redirectUri: `${window.location.origin}/${institute}`,
      }),
    );
    if (error) {
      console.error("Error al inicializar Keycloak", error);
      updateStoredToken(null);
      setAuthenticated(false);
      return null;
    }

    if (keycloak.token) {
      updateStoredToken(keycloak.token);
      setAuthenticated(true);
      return true;
    }

    setAuthenticated((prev) => (auth ? true : prev));
    return auth;
  }, [institute, keycloak, updateStoredToken]);

  useEffect(() => {
    initializeKeycloak();
  }, [initializeKeycloak]);

  const refreshToken = useCallback(async () => {
    if (!authenticated || !keycloak.token) return;

    const TOKEN_MIN_VALIDITY_SECONDS = 60;
    if (!keycloak.isTokenExpired(TOKEN_MIN_VALIDITY_SECONDS)) return;

    const { data: refreshed, error } = await tryCatch(
      keycloak.updateToken(TOKEN_MIN_VALIDITY_SECONDS),
    );
    if (error) {
      console.error("No se pudo refrescar el token", error);
      keycloak.clearToken();
      updateStoredToken(null);
      setAuthenticated(false);
      return;
    }

    if ((refreshed || keycloak.token) && keycloak.token) {
      updateStoredToken(keycloak.token);
      setAuthenticated(true);
    }
  }, [authenticated, keycloak, updateStoredToken]);

  useEffect(() => {
    if (!authenticated) return;

    const REFRESH_INTERVAL_MS = 30_000;
    const intervalId = window.setInterval(() => {
      void refreshToken();
    }, REFRESH_INTERVAL_MS);

    void refreshToken();

    return () => {
      window.clearInterval(intervalId);
    };
  }, [authenticated, refreshToken]);

  const login = async () => {
    await keycloak.login();
  };

  const logout = () => {
    keycloak.logout();
    keycloak.clearToken();
    updateStoredToken(null);
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ authenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useLogin = () => useContext(AuthContext);
