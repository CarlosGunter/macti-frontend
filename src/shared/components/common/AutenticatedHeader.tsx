"use client";

import { useLogin } from "@/shared/providers/LoginContext";

interface AutenticatedHeaderProps {
  institute: string;
}

export function AutenticatedHeader({ institute }: AutenticatedHeaderProps) {
  const { userInfo, logout } = useLogin();
  const initials = userInfo?.name
    ? userInfo.name
        .split(" ")
        .map((n) => n[0].toUpperCase())
        .join("")
    : "";

  return (
    <div className="relative inline-block group aspect-square">
      <button
        type="button"
        className="bg-primary text-primary-foreground border size-12 text-lg font-semibold grid place-items-center rounded-full p-2 hover:bg-primary/90 transition-colors"
      >
        {initials || "Sin nombre"}
      </button>

      <div className="hidden absolute right-0 pt-2.5 w-max shadow-lg z-10 group-hover:block">
        <div className="bg-card text-card-foreground p-1.5 shadow-lg z-10 ring ring-gray-700 rounded-md">
          <a
            href={`/${institute}/perfil`}
            className="block px-4 py-2 text-sm hover:text-accent-foreground transition-colors hover:bg-accent rounded-sm"
          >
            Perfil
          </a>
          <button
            type="button"
            onClick={logout}
            className="block w-full text-left px-4 py-2 text-sm hover:text-accent-foreground transition-colors hover:bg-accent rounded-sm"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
