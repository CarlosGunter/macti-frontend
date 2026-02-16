import { ProfileCard } from "@/domains/users/components/ui/ProfileCard";
import ProfileTabs from "@/shared/components/common/ProfileTabs";

interface PerfilPageProps {
  params: {
    institute: string;
  };
}

export default async function PerfilPage({ params }: PerfilPageProps) {
  const { institute } = await params;

  return (
    <div className="grid gap-8">
      <ProfileCard />

      <ProfileTabs institute={institute} />
    </div>
  );
}
