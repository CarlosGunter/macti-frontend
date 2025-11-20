import AccountRequestList from "@/domains/users/components/ListAccountRequest";
import { institutes } from "@/shared/config/institutes";

interface SolicitudesPageProps {
  params: {
    course_id: string;
    institute: string;
  };
}

export default async function SolicitudesPage({ params }: SolicitudesPageProps) {
  const { course_id, institute } = await params;

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-bold">{institutes[institute].name}</h1>
        <h2 className="text-xl">Solicitudes para el curso {course_id}</h2>
      </div>

      <AccountRequestList course_id={course_id} institute={institute} />
    </div>
  );
}
