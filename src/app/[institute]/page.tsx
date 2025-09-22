interface InstitutePageProps {
  params: {
    institute: string;
  };
}

export default function InstitutePage({ params }: InstitutePageProps) {
  const { institute } = params;

  return (
    <div>Institute Page {institute}</div>
  );
}