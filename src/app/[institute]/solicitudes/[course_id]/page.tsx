import UserReqAccountCard from "@/domains/users/components/UserReqAccountCard";

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
        <h1 className="text-2xl font-bold">{institute}</h1>
        <h2 className="text-xl">Solicitudes para el curso {course_id}</h2>
      </div>
      
      <div className="grid gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <UserReqAccountCard key={index} />
        ))}
      </div>
    </div>
  );
}