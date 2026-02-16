import AccountRequestList from "@/domains/users/components/ListAccountRequest";
import { fetchCourses } from "@/shared/services/fetchCourses";

interface SolicitudesPageProps {
  params: {
    course_id: string;
    institute: string;
  };
}

export default async function SolicitudesPage({ params }: SolicitudesPageProps) {
  const { course_id, institute } = await params;
  const instituteData =
    (await fetchCourses({ institute, ids: [parseInt(course_id, 10)] })) ?? [];

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-bold">
          {instituteData[0]?.fullname ?? "Sin nombre"}
        </h1>
        <h2 className="text-xl">Solicitudes de cuenta</h2>
      </div>

      <AccountRequestList course_id={course_id} institute={institute} />
    </div>
  );
}
