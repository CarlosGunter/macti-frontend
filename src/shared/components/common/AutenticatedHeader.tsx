"use client";

import { useLogin } from "@/shared/providers/LoginContext";

interface AutenticatedHeaderProps {
  institute: string;
}

export function AutenticatedHeader({ institute }: AutenticatedHeaderProps) {
  const { userInfo, logout } = useLogin();

  return (
    <div className="relative inline-block group">
      <button
        type="button"
        className="p-2 rounded-lg  bg-gray-800 text-white hover:bg-gray-700 transition-colors"
      >
        {userInfo?.name || "Sin nombre"}
      </button>

      <div className="hidden absolute right-0 pt-1 w-max shadow-lg z-10 group-hover:block">
        <div className="bg-gray-900 text-white shadow-lg z-10 border border-gray-700 rounded-lg">
          <a
            href={`${institute}/perfil`}
            className="block px-4 py-2 text-sm hover:bg-gray-800 transition-colors rounded-t-md"
          >
            Perfil
          </a>
          <button
            type="button"
            onClick={logout}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-800 transition-colors rounded-b-md"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
