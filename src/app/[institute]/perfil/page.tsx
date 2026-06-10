import type { Metadata } from "next";
import { ProfileCard } from "@/domains/users/components/ui/ProfileCard";
import ProfileTabs from "@/shared/components/common/ProfileTabs";

export const metadata: Metadata = {
  title: "Perfil | MACTI",
  description: "Revisa tu perfil, cursos y solicitudes dentro de tu instituto",
};

interface PerfilPageProps {
  params: Promise<{
    institute: string;
  }>;
}

export default async function PerfilPage({ params }: PerfilPageProps) {
  const { institute } = await params;

  return (
    <div className="grid gap-8">
      <ProfileCard institute={institute} />

      <ProfileTabs institute={institute} />
    </div>
  );
}
