import ListEnrolledCourses from "@/domains/courses/components/ListEnrolledCourses";
import { ProfileCard } from "@/domains/users/components/ui/ProfileCard";

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

      <div className="grid gap-4">
        <h1 className="font-bold text-2xl">Mis cursos</h1>
        <ListEnrolledCourses institute={institute} />
      </div>
    </div>
  );
}
