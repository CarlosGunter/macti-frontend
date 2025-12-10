import ListEnrolledCourses from "@/domains/courses/components/ListEnrolledCourses";
import { ProfileCard } from "@/domains/users/components/ProfileCard";

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
        <h2>Cursos administrados:</h2>
        <ListEnrolledCourses institute={institute} />
      </div>
    </div>
  );
}
