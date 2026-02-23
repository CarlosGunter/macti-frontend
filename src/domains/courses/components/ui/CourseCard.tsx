interface CourseCardProps {
  children?: React.ReactNode;
  courseId: number;
  title: string;
  description?: string | null;
}

export default function CourseCard({ children, title, description }: CourseCardProps) {
  return (
    <section className="flex justify-between w-full rounded-3xl bg-card border p-8 text-foreground dark:shadow-[0_30px_60px_rgba(0,0,0,0.45)]">
      <div className="grid gap-2">
        <h2 className="font-semibold text-lg">{title}</h2>
        <p className="text-sm text-foreground/70">{description || "Curso de MACTI"}</p>
      </div>
      <div className="flex gap-2 items-center">{children}</div>
    </section>
  );
}
