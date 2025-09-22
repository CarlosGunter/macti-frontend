import Hero from "@/domains/home/components/Hero";
import CardInstitutes from "@/domains/home/components/CardInstitutes";
import { institutes } from "@/shared/config/institutes";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="max-w-7xl mx-auto p-2">
        <main className="grid gap-4 w-full">
          <h2 className="text-center text-2xl font-bold">Institutos</h2>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(institutes).map(([key, institute]) => (
              <CardInstitutes key={key} id={key} {...institute} />
            ))}
          </section>
        </main>
      </div>
    </>
  );
}
