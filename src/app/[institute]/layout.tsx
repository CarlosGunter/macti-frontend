import Header from "@/shared/components/common/Header";
import { ChunkErrorBoundary } from "@/shared/components/feedback/ChunkErrorBoundary";
import { LoginProvider } from "@/shared/providers/LoginContext";

interface LayoutProps {
  children: React.ReactNode;
  params: { institute: string };
}

export default async function Layout({ children, params }: LayoutProps) {
  const { institute } = await params;
  return (
    <ChunkErrorBoundary>
      <LoginProvider institute={institute}>
        <Header institute={institute} />
        <div className="max-w-6xl mx-auto p-2">{children}</div>
      </LoginProvider>
    </ChunkErrorBoundary>
  );
}
