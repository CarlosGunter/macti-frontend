"use client";

import { useLogin } from "@/shared/providers/LoginContext";

export function LoginButton() {
  const { authenticated, login, logout } = useLogin();

  return (
    // biome-ignore lint: false positive
    <span
      role="button"
      className="px-4 py-2 rounded-sm bg-black/40 hover:bg-black/70 active:bg-black/90 transition-colors duration-200 cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        authenticated ? logout() : login();
      }}
    >
      {authenticated ? "Logout" : "Login"}
    </span>
  );
}
