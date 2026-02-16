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
    <div className="w-full max-w-md mx-auto py-10 px-4">
      <QueryContextProvider>
        <AccountRequestForm institute={institute} />
      </QueryContextProvider>
    </div>
  );
}
