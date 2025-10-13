import { notFound } from "next/navigation";
import CreateAccount from "@/domains/auth/components/CreateAccoutForm";
import { fetchAccountInfo } from "@/domains/auth/services/fetchAccountInfo";

interface ConfirmacionPageProps {
  searchParams: {
    token?: string;
  };
}

export default async function ConfirmacionPage({ searchParams }: ConfirmacionPageProps) {
  const { token } = await searchParams;
  if (!token) notFound();

  const userData = (await fetchAccountInfo(token)) as Record<
    string,
    Record<string, string>
  > | null;
  if (!userData) notFound();

  return (
    <div className="grid gap-8 p-4 place-items-center content-center min-h-dvh">
      <div className="text-center grid gap-2">
        <h1 className="text-2xl mb-2">Solicitud de cuenta aprobada</h1>
        <p className="font-semibold">{userData.data.email}</p>
        <p className="text-xs">Escribe una contraseña para completar tu registro</p>
      </div>

      <CreateAccount userData={userData.data} />
    </div>
  );
}
