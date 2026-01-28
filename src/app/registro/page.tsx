import AccountRequestForm from "@/domains/auth/components/AccountRequestForm";

interface RegistroPageProps {
  searchParams: {
    institute: string;
  };
}

export default async function RegistroPage({ searchParams }: RegistroPageProps) {
  const { institute } = await searchParams;

  return (
    <div className="grid gap-8 p-4 place-items-center content-center min-h-vh">
      <div className="text-center grid gap-2">
        <h1 className="text-2xl font-bold">Solicitar Registro para MACTI</h1>
        <p className="text-sm">
          Nota: Cada instituto tiene su propio Registro. Asegúrate de estar en el
          correcto.
        </p>
      </div>

      <AccountRequestForm institute={institute} />
    </div>
  );
}
