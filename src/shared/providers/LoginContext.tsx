"use client";

import Keycloak, { type KeycloakInitOptions, type KeycloakProfile } from "keycloak-js";
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { keycloakConfigs } from "@/shared/config/kcConfig";
import { usePageVisibility } from "@/shared/hooks/usePageVisibility";
import { tryCatch } from "@/shared/utils/try-catch";

type KeycloakProfileExtended = Omit<KeycloakProfile, "totp"> & {
  name?: string;
};

type AuthContextType = {
  authenticated: boolean;
  token?: string;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  userInfo: KeycloakProfileExtended;
};

const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  userInfo: {},
});

const TOKEN_MIN_VALIDITY_SECONDS = 60;
const REFRESH_INTERVAL_MS = 30_000;

const getStorageKeys = (institute: keyof typeof keycloakConfigs) => ({
  token: `${institute}_token`,
  refreshToken: `${institute}_refreshToken`,
  idToken: `${institute}_idToken`,
});

interface LoginProviderProps {
  children: React.ReactNode;
  institute: keyof typeof keycloakConfigs;
}

export function LoginProvider({ children, institute }: LoginProviderProps) {
  const keycloak = useMemo(() => {
    const config = keycloakConfigs[institute] ?? keycloakConfigs.principal;
    return new Keycloak(config);
  }, [institute]);

  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState<string | undefined>();
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const initializedRef = useRef(false);
  const refreshingRef = useRef(false);
  const isVisible = usePageVisibility();
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

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

      if (!institute) return;

      const STORAGE_KEYS = getStorageKeys(institute);
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
    [institute],
  );

  useEffect(() => {
    if (!institute) {
      setAuthenticated(false);
      setToken(undefined);
      setIsAuthLoading(false);
      return;
    }

    const STORAGE_KEYS = getStorageKeys(institute);
    const storedToken = localStorage.getItem(STORAGE_KEYS.token);
    if (!storedToken) {
      setAuthenticated(false);
      setToken(undefined);
      setIsAuthLoading(false);
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
        setIsAuthLoading(false);
        return;
      }

      setToken(storedToken);
      setAuthenticated(true);
      setIsAuthLoading(false);
    } catch (error) {
      console.error("No se pudo validar el token almacenado", error);
      persistTokens();
      setAuthenticated(false);
      setIsAuthLoading(false);
    }
  }, [institute, persistTokens]);

  const initializeKeycloak = useCallback(async () => {
    if (!institute) {
      setIsAuthLoading(false);
      return null;
    }

    const STORAGE_KEYS = getStorageKeys(institute);
    const storedToken = localStorage.getItem(STORAGE_KEYS.token) ?? undefined;
    const storedRefreshToken =
      localStorage.getItem(STORAGE_KEYS.refreshToken) ?? undefined;
    const storedIdToken = localStorage.getItem(STORAGE_KEYS.idToken) ?? undefined;

    const initOptions: KeycloakInitOptions = {
      checkLoginIframe: false, // Deshabilitado: navegadores modernos bloquean cookies de terceros
      redirectUri: `${window.location.origin}/${institute}`,
      enableLogging: process.env.NODE_ENV === "development",
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
      setIsAuthLoading(false);
      return null;
    }

    if (!keycloak.token || !keycloak.refreshToken) {
      persistTokens();
      setAuthenticated(false);
      setIsAuthLoading(false);
      return auth ?? null;
    }

    persistTokens({
      token: keycloak.token,
      refreshToken: keycloak.refreshToken,
      idToken: keycloak.idToken ?? null,
    });

    setAuthenticated(true);
    setIsAuthLoading(false);
    return true;
  }, [institute, keycloak, persistTokens]);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    initializeKeycloak();
  }, [initializeKeycloak]);

  // Broadcast Channel API para sincronización moderna entre pestañas
  useEffect(() => {
    if (!institute || typeof BroadcastChannel === "undefined") return;

    const channelName = `keycloak_${institute}`;
    const channel = new BroadcastChannel(channelName);
    broadcastChannelRef.current = channel;

    channel.onmessage = (event) => {
      const { type, payload } = event.data;

      switch (type) {
        case "TOKEN_UPDATED":
          console.info("Keycloak: token actualizado en otra pestaña (BC)");
          if (payload.token) {
            setToken(payload.token);
            keycloak.token = payload.token;
            keycloak.refreshToken = payload.refreshToken;
            keycloak.idToken = payload.idToken;
            setAuthenticated(true);
          }
          break;

        case "LOGOUT":
          console.info("Keycloak: logout recibido de otra pestaña (BC)");
          keycloak.clearToken();
          setToken(undefined);
          setAuthenticated(false);
          break;

        case "LOGIN":
          console.info("Keycloak: login recibido de otra pestaña (BC)");
          if (payload.token) {
            setToken(payload.token);
            keycloak.token = payload.token;
            keycloak.refreshToken = payload.refreshToken;
            keycloak.idToken = payload.idToken;
            setAuthenticated(true);
          }
          break;
      }
    };

    return () => {
      channel.close();
      broadcastChannelRef.current = null;
    };
  }, [institute, keycloak]);

  // Storage Events como fallback para navegadores sin Broadcast Channel
  useEffect(() => {
    if (!institute) return;

    const STORAGE_KEYS = getStorageKeys(institute);

    const handleStorageChange = (event: StorageEvent) => {
      // Solo procesar eventos de este instituto
      if (!event.key || !Object.values(STORAGE_KEYS).includes(event.key)) {
        return;
      }

      // Si el token fue removido en otra pestaña, cerrar sesión aquí también
      if (event.key === STORAGE_KEYS.token && !event.newValue) {
        console.info("Keycloak: sesión cerrada en otra pestaña (Storage)");
        keycloak.clearToken();
        setToken(undefined);
        setAuthenticated(false);
        return;
      }

      // Si se actualizó el token en otra pestaña, sincronizar
      if (event.key === STORAGE_KEYS.token && event.newValue) {
        console.info("Keycloak: token actualizado en otra pestaña (Storage)");
        setToken(event.newValue);
        keycloak.token = event.newValue;
        setAuthenticated(true);
      }

      if (event.key === STORAGE_KEYS.refreshToken && event.newValue) {
        keycloak.refreshToken = event.newValue;
      }

      if (event.key === STORAGE_KEYS.idToken && event.newValue) {
        keycloak.idToken = event.newValue;
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [institute, keycloak]);

  // Manejo de eventos de Keycloak para sincronización
  useEffect(() => {
    const notifyOtherTabs = (type: string, payload?: any) => {
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({ type, payload });
      }
    };

    const handleAuthSuccess = () => {
      console.info("Keycloak: autenticación exitosa");
      const tokens = {
        token: keycloak.token,
        refreshToken: keycloak.refreshToken,
        idToken: keycloak.idToken,
      };
      persistTokens(tokens);
      setAuthenticated(true);
      notifyOtherTabs("LOGIN", tokens);
    };

    const handleAuthError = () => {
      console.warn("Keycloak: error de autenticación");
      keycloak.clearToken();
      persistTokens();
      setAuthenticated(false);
      notifyOtherTabs("LOGOUT");
    };

    const handleAuthLogout = () => {
      console.info("Keycloak: sesión cerrada");
      keycloak.clearToken();
      persistTokens();
      setAuthenticated(false);
      notifyOtherTabs("LOGOUT");
    };

    keycloak.onAuthSuccess = handleAuthSuccess;
    keycloak.onAuthError = handleAuthError;
    keycloak.onAuthLogout = handleAuthLogout;

    return () => {
      keycloak.onAuthSuccess = undefined;
      keycloak.onAuthError = undefined;
      keycloak.onAuthLogout = undefined;
    };
  }, [keycloak, persistTokens]);

  const refreshToken = useCallback(
    async (minValidity: number = TOKEN_MIN_VALIDITY_SECONDS) => {
      if (!institute || refreshingRef.current) return false;

      refreshingRef.current = true;
      try {
        const STORAGE_KEYS = getStorageKeys(institute);

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

        const tokens = {
          token: keycloak.token ?? null,
          refreshToken: keycloak.refreshToken ?? null,
          idToken: keycloak.idToken ?? null,
        };
        persistTokens(tokens);
        setAuthenticated(Boolean(keycloak.token));

        // Notificar a otras pestañas sobre el token actualizado
        if (refreshed && broadcastChannelRef.current) {
          broadcastChannelRef.current.postMessage({
            type: "TOKEN_UPDATED",
            payload: tokens,
          });
        }

        return Boolean(refreshed);
      } finally {
        refreshingRef.current = false;
      }
    },
    [institute, keycloak, persistTokens],
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

  // Validar token cuando la pestaña se vuelve visible
  useEffect(() => {
    if (isVisible && authenticated) {
      // Revalidar token inmediatamente cuando la pestaña se vuelve visible
      void refreshToken();
    }
  }, [isVisible, authenticated, refreshToken]);

  // Actualización periódica de tokens solo en pestañas visibles
  useEffect(() => {
    if (!authenticated || !isVisible) return;

    const intervalId = window.setInterval(() => {
      void refreshToken();
    }, REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [authenticated, isVisible, refreshToken]);

  const login = async () => {
    await keycloak.login();
  };

  const logout = () => {
    keycloak.logout();
    keycloak.clearToken();
    persistTokens();
    setAuthenticated(false);

    // Notificar a otras pestañas
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({ type: "LOGOUT" });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        token,
        isLoading: isAuthLoading,
        login,
        logout,
        userInfo: keycloak.tokenParsed as KeycloakProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useLogin = () => useContext(AuthContext);
