import Header from "@/shared/components/common/Header";
import { LoginProvider } from "@/shared/providers/LoginContext";

interface LayoutProps {
  children: React.ReactNode;
  params: { institute: string };
}

export default async function Layout({ children, params }: LayoutProps) {
  const { institute } = await params;
  return (
    <LoginProvider institute={institute}>
      <Header />
      <div className="max-w-6xl mx-auto p-2">{children}</div>
    </LoginProvider>
  );
}
