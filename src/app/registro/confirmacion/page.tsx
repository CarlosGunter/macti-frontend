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

  const userData = await fetchAccountInfo(token);
  if (!userData) notFound();

  return (
    <div className="w-full max-w-md mx-auto py-10 px-4">
      <CreateAccount userData={userData} />
    </div>
  );
}
