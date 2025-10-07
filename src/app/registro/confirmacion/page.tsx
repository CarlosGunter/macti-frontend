import CreateAccount from "@/domains/auth/components/CreateAccoutForm";
import { fetchAccountInfo } from "@/domains/auth/services/fetchAccountInfo";
import { notFound } from "next/navigation";

interface ConfirmacionPageProps {
  searchParams: {
    token?: string;
  };
}

export default async function ConfirmacionPage({ searchParams }: ConfirmacionPageProps) {
  const { token } = await searchParams;
  if (!token) notFound();

  const userData = await fetchAccountInfo(token) as Record<string, any>;
  if (!userData) notFound();

  return (
    <div className="grid gap-8 p-4 justify-center">
      <div className="text-center">
        <h1>Solicitud de cuenta aprobada</h1>
        <p>{userData.data.correo}</p>
        <p className="text-xs">Escribe una contraseña para completar tu registro:</p>
      </div>

      <CreateAccount userData={userData.data} />
    </div>
  );
}