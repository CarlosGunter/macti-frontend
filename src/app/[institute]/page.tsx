import CourseCard from "@/domains/courses/components/CourseCard";
import { institutes } from "@/shared/config/institutes";
import Link from "next/dist/client/link";
import { notFound } from "next/navigation";

interface InstitutePageProps {
  params: {
    institute: string;
  };
}

export default async function InstitutePage({ params }: InstitutePageProps) {
  const { institute } = await params;
  const validInstitute = institutes[institute];
  
  if (!validInstitute) {
    notFound();
  }

  return (
    <>
      <div className="grid justify-center text-center p-6">
        <h1 className="text-2xl font-bold">Instituto: {institutes[institute].name}</h1>
        <p>Bienvenido al portal del instituto {institutes[institute].name}.</p>

        <div className="flex justify-center gap-4 py-4">
          <Link href='http://jupyter.org' className="px-4 py-2 bg-blue-500 text-white rounded">Jupyter</Link>
          <Link href='http://moodle.org' className="px-4 py-2 bg-blue-500 text-white rounded">Moodle</Link>
        </div>
      </div>

      <div className="grid gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <CourseCard key={index}
          title={`Curso ${index + 1}`}
          description={`Descripción del curso ${index + 1}`} >
            <Link href={`/${institute}/curso/${index + 1}`} className="px-4 py-2 bg-blue-500 text-white text-sm rounded">
              Ir al curso
            </Link>
          </CourseCard>
        ))}
      </div>
    </>
  );
}