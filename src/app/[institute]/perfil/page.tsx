import CourseCard from "@/domains/courses/components/CourseCard";

export default function PerfilPage() {
  return (
    <div className="grid gap-8">
      <h1 className="text-2xl font-bold">Perfil de usuario</h1>
      <div>
        <p>Nombre de usuario</p>
        <p className="text-sm">Email del usuario</p>
        <p className="text-sm">Institución: Nombre de la institución</p>
      </div>

      <div className="grid gap-4">
        <h2>Cursos inscritos/administrados</h2>
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <CourseCard key={index}
            title={`Curso ${index + 1}`}
            description={`Descripción del curso ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}