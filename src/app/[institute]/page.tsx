import { notFound } from "next/navigation";
import ListInstituteCourses from "@/domains/courses/components/ListInstituteCourses";
import { Anchor } from "@/shared/components/ui/Anchor";
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
          <Anchor href={currentInstitute.moodle}>Moodle</Anchor>
          <Anchor href={currentInstitute.jupyter}>Jupyter</Anchor>
        </div>
      </div>

      <ListInstituteCourses institute={institute} />
    </>
  );
}
