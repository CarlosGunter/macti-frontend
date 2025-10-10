export default function RegistroLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col items-center justify-center min-h-dvh max-w-6xl mx-auto p-2">
      {children}
    </main>
  );
}
