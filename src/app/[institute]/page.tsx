import { notFound } from "next/navigation";
import ListInstituteCourses from "@/domains/courses/components/ListInstituteCourses";
import { institutes } from "@/shared/config/institutes";

interface InstitutePageProps {
  params: {
    institute: string;
  };
}

export const revalidate = 43200; // 12 horas en segundos

export async function generateStaticParams(): Promise<InstitutePageProps["params"][]> {
  return Object.keys(institutes).map((institute) => ({
    institute,
  }));
}

export default async function InstitutePage({ params }: InstitutePageProps) {
  const { institute } = await params;
  const currentInstitute = institutes[institute];

  if (!currentInstitute) notFound();

  return (
    <>
      <div className="grid justify-center text-center p-6">
        <h1 className="text-2xl font-bold">Instituto: {currentInstitute.name}</h1>
        <p>Bienvenido al portal del instituto {currentInstitute.name}.</p>

        <div className="flex justify-center gap-4 py-4">
          <a
            href="http://jupyter.org"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Jupyter
          </a>
          <a
            href="http://moodle.org"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Moodle
          </a>
        </div>
      </div>

      <ListInstituteCourses institute={institute} />
    </>
  );
}
