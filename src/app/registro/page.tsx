import AccountRequestForm from "@/domains/auth/components/AccountRequestForm";
import { QueryContextProvider } from "@/shared/providers/QueryProvider";

interface RegistroPageProps {
  searchParams: {
    institute: string;
  };
}

export default async function RegistroPage({ searchParams }: RegistroPageProps) {
  const { institute } = await searchParams;

  return (
    <div className="w-full max-w-md mx-auto py-10 px-4 grid gap-4">
      <QueryContextProvider>
        <AccountRequestForm institute={institute} />
      </QueryContextProvider>
      <p className="text-foreground font-medium text-center text-sm">
        ¿Eres Profesor?{" "}
        <a href="/registro/profesor" className="text-blue-500 hover:underline">
          Regístrate aquí
        </a>
      </p>
    </div>
  );
}
