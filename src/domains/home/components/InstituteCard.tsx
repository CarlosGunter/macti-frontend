"use client";

import Link from "next/dist/client/link";
import type { StaticImageData } from "next/image";
import { LoginProvider } from "@/shared/providers/LoginContext";
import { LoginCardButton } from "./ui/LoginInCardButton";

interface Institute {
  id: string;
  name: string;
  details: string;
  image: StaticImageData;
}

export default function InstituteCard({ id, name, details, image }: Institute) {
  return (
    <article className="relative grid group rounded-2xl overflow-hidden">
      <Link
        className="h-48 rounded-2xl bg-black/50 bg-(image:--img) bg-cover bg-center bg-no-repeat bg-blend-darken text-white row-start-1 row-end-2 col-start-1 col-end-2"
        href={details}
        style={{ "--img": `url(${image.src})` } as React.CSSProperties}
      />
      <div className="grid place-items-center h-48 pointer-events-none grid-rows-1 grid-cols-1 row-start-1 row-end-2 col-start-1 col-end-2">
        <h2 className="text-center font-bold text-lg transition-[translate] -translate-y-10 md:translate-0 md:group-hover:-translate-y-10">
          {name}
        </h2>
        <div className="absolute flex gap-2 bottom-7 md:opacity-0 md:translate-y-7 transition-[opacity,translate] md:group-hover:opacity-100 md:group-hover:translate-y-0">
          <LoginProvider institute={id}>
            <LoginCardButton />
          </LoginProvider>
          <button
            type="button"
            className="px-4 py-2 rounded-sm bg-black/40 hover:bg-black/70 active:bg-black/90 cursor-pointer pointer-events-auto"
            onClick={(e) => {
              e.preventDefault();
              window.open(`/registro?institute=${id}`, "_self");
            }}
          >
            Registro
          </button>
        </div>
      </div>
    </article>
  );
}
