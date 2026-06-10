import { notFound } from "next/navigation";
import ListInstituteCourses from "@/domains/courses/components/ListInstituteCourses";
import { Anchor } from "@/shared/components/ui/Anchor";
import { institutes } from "@/shared/config/institutes";

export const revalidate = 12 * 60 * 60; // 12 horas en segundos

interface InstitutePageProps {
  params: Promise<{
    institute: string;
  }>;
}

export async function generateMetadata({ params }: InstitutePageProps) {
  const { institute } = await params;
  const currentInstitute = institutes[institute];

  return {
    title: `${currentInstitute.name} | MACTI`,
    description: `Bienvenido al portal del instituto ${currentInstitute.name}.`,
  };
}

type InstituteStaticParams = {
  institute: string;
};

export async function generateStaticParams(): Promise<InstituteStaticParams[]> {
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
