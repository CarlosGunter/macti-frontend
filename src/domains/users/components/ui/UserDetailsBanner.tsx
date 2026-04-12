"use client";

import { getAuthClient } from "@/shared/lib/auth-client";

export default function UserDetailsBanner({ institute }: { institute: string }) {
  const authClient = getAuthClient(institute);
  const session = authClient.useSession();
  const userInfo = session?.data?.user;

  const identifier = userInfo?.name || "Usuario pendiente";
  const email = userInfo?.email || "Correo no disponible";
  const isVerified = Boolean(userInfo?.email);

  const infoBlocks = [
    { label: "Instituto", value: institute },
    { label: "Correo", value: email },
    { label: "Usuario", value: identifier },
    { label: "Estado", value: isVerified ? "Verificado" : "Sin confirmar" },
  ];

  return (
    <dl className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
      {infoBlocks.map(({ label, value }) => (
        <div
          key={label}
          className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur"
        >
          <dt className="text-xs uppercase tracking-[0.3em] text-white/50">{label}</dt>
          <dd className="mt-2 text-lg font-medium text-white">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
