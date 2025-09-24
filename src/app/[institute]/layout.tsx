import Header from "@/shared/components/common/Header"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto p-2">
        {children}
      </div>
    </>
  );
}
