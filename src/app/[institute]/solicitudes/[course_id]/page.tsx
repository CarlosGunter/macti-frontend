interface SolicitudesPageProps {
  params: {
    course_id: string;
  };
}

export default async function SolicitudesPage({ params }: SolicitudesPageProps) {
  const { course_id } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Solicitudes de inscripción para el curso {course_id}</h1>
    </div>
  );
}