import Image from "next/image";
import mactiLogo from "@/assets/image/logos/macti_logo.png";

export default function Hero() {
  return (
    <div
      className={`relative w-full h-80 flex flex-col items-center justify-center gap-4 bg-[url(/svg/low-poly-grid-haikei.svg)] bg-cover bg-center bg-no-repeat bg-fixed md:h-96 lg:h-130`}
    >
      <Image src={mactiLogo} alt="MACTI Logo" className="w-36 h-auto" />
      <p className="max-w-xl text-center px-2">
        Una plataforma que alberga materiales didácticos haciendo énfasis en ejemplos
        prácticos y aplicaciones de conceptos abstractos para los cursos semestrales de
        análisis Numérico y Ecuaciones Diferenciales.
      </p>
    </div>
  );
}
