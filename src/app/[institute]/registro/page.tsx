import { institutes } from "@/shared/config/institutes";
import RequestAccountForm from "@/domains/auth/components/RequestAccountForm";

interface RegistroPageProps {
  params: {
    institute: string;
  };
}

export default function RegistroPage({ params }: RegistroPageProps) {
  const { institute } = params;

  return (
    <div className="grid gap-8 p-4 justify-center">
      <div>
        <h1>Solicitar Registro para: {institutes[institute].name}</h1>
        <p className="text-xs">
          Nota: El profesor a cargo del curso debe confirmar tu registro.
        </p>
      </div>

      <RequestAccountForm />
    </div>
  );
}
