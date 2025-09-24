interface CourseCardProps {
  title: string;
  description: string;
}

export default function CourseCard({ title, description }: CourseCardProps) {
  return (
    <section className="flex justify-between w-full p-4 border rounded shadow">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="flex gap-2 items-center">
        <a href="/solicitudes" className="px-4 py-2 bg-blue-500 text-white rounded">
          Solicitudes
        </a>
      </div>
    </section>
  );
}