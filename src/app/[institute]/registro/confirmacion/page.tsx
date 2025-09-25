import CreateAccount from "@/domains/auth/components/CreateAccout";
import { notFound } from "next/navigation";

interface ConfirmacionPageProps {
  searchParams: {
    token?: string;
  };
}

export default async function ConfirmacionPage({ searchParams }: ConfirmacionPageProps) {
  const { token } = await searchParams;

  if (!token) {
    notFound();
  }

  return (
    <div className="grid gap-8 p-4 justify-center">
      <div>
        <h1>Solicitud de cuenta aprobada</h1>
        <p className="text-xs">Escribe una contraseña para completar tu registro:</p>
      </div>

      <CreateAccount />
    </div>
  );
}