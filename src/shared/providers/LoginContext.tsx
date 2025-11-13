"use client";

import Keycloak, { type KeycloakInitOptions } from "keycloak-js";
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

const TOKEN_MIN_VALIDITY_SECONDS = 60;
const REFRESH_INTERVAL_MS = 30_000;
const STORAGE_KEYS = {
  token: "token",
  refreshToken: "refreshToken",
  idToken: "idToken",
};

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

  const persistTokens = useCallback(
    ({
      token: tokenValue,
      refreshToken: refreshTokenValue,
      idToken: idTokenValue,
    }: {
      token?: string | null;
      refreshToken?: string | null;
      idToken?: string | null;
    } = {}) => {
      setToken(tokenValue ?? undefined);

      const entries: Array<[string, string | null | undefined]> = [
        [STORAGE_KEYS.token, tokenValue],
        [STORAGE_KEYS.refreshToken, refreshTokenValue],
        [STORAGE_KEYS.idToken, idTokenValue],
      ];

      for (const [key, value] of entries) {
        try {
          if (value == null || value === "") {
            localStorage.removeItem(key);
          } else {
            localStorage.setItem(key, value);
          }
        } catch (error) {
          console.error(`Keycloak: no se pudo persistir ${key}`, error);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.token);
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
        persistTokens();
        setAuthenticated(false);
        return;
      }

      setToken(storedToken);
      setAuthenticated(true);
    } catch (error) {
      console.error("No se pudo validar el token almacenado", error);
      persistTokens();
      setAuthenticated(false);
    }
  }, [persistTokens]);

  const initializeKeycloak = useCallback(async () => {
    if (!institute) return null;

    const storedToken = localStorage.getItem(STORAGE_KEYS.token) ?? undefined;
    const storedRefreshToken =
      localStorage.getItem(STORAGE_KEYS.refreshToken) ?? undefined;
    const storedIdToken = localStorage.getItem(STORAGE_KEYS.idToken) ?? undefined;

    const initOptions: KeycloakInitOptions = {
      checkLoginIframe: false,
      redirectUri: `${window.location.origin}/${institute}`,
    };

    if (storedToken && storedRefreshToken) {
      initOptions.token = storedToken;
      initOptions.refreshToken = storedRefreshToken;
      if (storedIdToken) initOptions.idToken = storedIdToken;
    }

    const { data: auth, error } = await tryCatch(keycloak.init(initOptions));
    if (error) {
      console.error("Error al inicializar Keycloak", error);
      persistTokens();
      setAuthenticated(false);
      return null;
    }

    if (!keycloak.token || !keycloak.refreshToken) {
      persistTokens();
      setAuthenticated(false);
      return auth ?? null;
    }

    persistTokens({
      token: keycloak.token,
      refreshToken: keycloak.refreshToken,
      idToken: keycloak.idToken ?? null,
    });

    setAuthenticated(true);
    return true;
  }, [institute, keycloak, persistTokens]);

  useEffect(() => {
    initializeKeycloak();
  }, [initializeKeycloak]);

  const refreshToken = useCallback(
    async (minValidity: number = TOKEN_MIN_VALIDITY_SECONDS) => {
      if (!keycloak.token) {
        const storedToken = localStorage.getItem(STORAGE_KEYS.token);
        if (storedToken) keycloak.token = storedToken;
      }

      if (!keycloak.refreshToken) {
        const storedRefreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
        if (storedRefreshToken) keycloak.refreshToken = storedRefreshToken;
      }

      if (!keycloak.idToken) {
        const storedIdToken = localStorage.getItem(STORAGE_KEYS.idToken);
        if (storedIdToken) keycloak.idToken = storedIdToken;
      }

      if (!keycloak.token || !keycloak.refreshToken) {
        console.warn("Keycloak: no se encontraron tokens suficientes para refrescar.");
        persistTokens();
        setAuthenticated(false);
        return false;
      }

      const { data: refreshed, error } = await tryCatch(
        keycloak.updateToken(minValidity),
      );
      if (error) {
        console.error("Keycloak: no se pudo refrescar el token", error);
        keycloak.clearToken();
        persistTokens();
        setAuthenticated(false);
        return false;
      }

      if (refreshed) {
        console.info("Keycloak: token refrescado correctamente");
      } else {
        console.debug("Keycloak: token vigente, no fue necesario refrescar");
      }

      persistTokens({
        token: keycloak.token ?? null,
        refreshToken: keycloak.refreshToken ?? null,
        idToken: keycloak.idToken ?? null,
      });
      setAuthenticated(Boolean(keycloak.token));

      return Boolean(refreshed);
    },
    [keycloak, persistTokens],
  );

  useEffect(() => {
    keycloak.onTokenExpired = () => {
      console.warn("Keycloak: token reportado como expirado, intentando refrescar");
      void refreshToken(-1);
    };

    return () => {
      keycloak.onTokenExpired = undefined;
    };
  }, [keycloak, refreshToken]);

  useEffect(() => {
    if (!authenticated) return;

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
    persistTokens();
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ authenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useLogin = () => useContext(AuthContext);
