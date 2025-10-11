'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Keycloak from 'keycloak-js';
import { useParams } from 'next/navigation';
import { keycloakConfigs } from '@/shared/config/kcConfig';

type AuthContextType = {
  authenticated: boolean;
  token?: string;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  login: () => {},
  logout: () => {},
});

interface LoginProviderProps {
  children: React.ReactNode;
  institute?: string;
}

export const LoginProvider = ({ children, institute: propInstitute }: LoginProviderProps) => {
  const { institute: paramInstitute } = useParams();
  // Esto permite usar el provider tanto con prop como en rutas dinámicas
  const institute = propInstitute || paramInstitute;

  const [authenticated, setAuthenticated] = useState(false);
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);

  const initializeKeycloak = () => {
    if (!institute) return;

    const cfg = keycloakConfigs[institute as string];
    if (!cfg) {
      console.error(`No hay configuración para el instituto ${institute}`);
      return;
    }

    const kc = new Keycloak(cfg);
    setKeycloak(kc);

    kc.init({ onLoad: 'check-sso', silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html' })
      .then(auth => {
        setAuthenticated(auth);
        if (auth) localStorage.setItem('token', kc.token!);
      })
      .catch(console.error);
  };

  const login = () => {
    if (!keycloak) initializeKeycloak();
    keycloak?.login();
  };

  const logout = () => keycloak?.logout();

  return (
    <AuthContext.Provider
      value={{ authenticated, token: keycloak?.token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useLogin = () => useContext(AuthContext);
