"use client";

import { useLogin } from "@/shared/providers/LoginContext";
import Button from "./Button";

export function LoginButton() {
  const { authenticated, login, logout } = useLogin();

  return (
    <Button
      type="button"
      onClick={async () => {
        console.log(authenticated);
        authenticated ? logout() : await login();
      }}
    >
      {authenticated ? "Logout" : "Login"}
    </Button>
  );
}
