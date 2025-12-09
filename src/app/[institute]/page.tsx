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
            className="flex justify-center items-center gap-2 p-2 rounded-lg transition-shadow duration-200 bg-black text-white hover:ring-2 hover:ring-gray-900 dark:bg-gray-200 dark:text-black dark:hover:ring-offset-2 dark:hover:ring-current"
          >
            Jupyter
          </a>
          <a
            href="http://moodle.org"
            className="flex justify-center items-center gap-2 p-2 rounded-lg transition-shadow duration-200 bg-black text-white hover:ring-2 hover:ring-gray-900 dark:bg-gray-200 dark:text-black dark:hover:ring-offset-2 dark:hover:ring-current"
          >
            Moodle
          </a>
        </div>
      </div>

      <ListInstituteCourses institute={institute} />
    </>
  );
}
