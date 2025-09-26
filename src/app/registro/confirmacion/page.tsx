import CreateAccount from "@/domains/auth/components/CreateAccoutForm";
import { verifyToken } from "@/domains/auth/services/verifyToken";
import { notFound } from "next/navigation";
import { use } from "react";

interface ConfirmacionPageProps {
  searchParams: {
    token?: string;
  };
}

export default async function ConfirmacionPage({ searchParams }: ConfirmacionPageProps) {
  const { token } = await searchParams;
  if (!token) notFound();

  const userData = await verifyToken(token);
  if (!userData.success) notFound();
  console.log(userData)
  return (
    <div className="grid gap-8 p-4 justify-center">
      <div className="text-center">
        <h1>Solicitud de cuenta aprobada</h1>
        <p>{userData.data.correo}</p>
        <p className="text-xs">Escribe una contraseña para completar tu registro:</p>
      </div>

      <CreateAccount />
    </div>
  );
}