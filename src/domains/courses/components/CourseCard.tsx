interface CourseCardProps {
  children?: React.ReactNode;
  title: string;
  description: string;
}

export default function CourseCard({ children, title, description }: CourseCardProps) {
  return (
    <section className="flex justify-between w-full p-4 border rounded-lg shadow">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="flex gap-2 items-center">{children}</div>
    </section>
  );
}
