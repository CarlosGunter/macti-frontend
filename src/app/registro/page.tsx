import RequestAccountForm from "@/domains/auth/components/RequestAccountForm";

interface RegistroPageProps {
  searchParams: {
    institute: string;
  };
}

export default async function RegistroPage({ searchParams }: RegistroPageProps) {
  const { institute } = await searchParams;

  return (
    <div className="grid gap-8 p-4 justify-center">
      <div className="text-center">
        <h1>Solicitar Registro para MACTI</h1>
        <p className="text-xs">
          Nota: Cada instituto tiene su propio Registro. Asegúrate de estar en el correcto.
        </p>
      </div>

      <RequestAccountForm institute={institute} />
    </div>
  );
}
