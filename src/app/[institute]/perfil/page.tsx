import Link from "next/link";
import CourseCard from "@/domains/courses/components/CourseCard";
import ListEnrolledCourses from "@/domains/courses/components/ListEnrolledCourses";

interface PerfilPageProps {
  params: {
    institute: string;
  };
}

export default async function PerfilPage({ params }: PerfilPageProps) {
  const { institute } = await params;

  return (
    <div className="grid gap-8">
      <h1 className="text-2xl font-bold">Perfil de usuario</h1>
      <div>
        <p>Nombre de usuario</p>
        <p className="text-sm">Email del usuario</p>
        <p className="text-sm">Institución: Nombre de la institución</p>
      </div>

      <div className="grid gap-4">
        <h2>Cursos administrados:</h2>
        <ListEnrolledCourses institute={institute} />
      </div>
    </div>
  );
}
