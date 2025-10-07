'use client';

import { StaticImageData } from 'next/image';

interface Institute {
  id: string;
  name: string;
  details: string;
  image: StaticImageData;
}

export default function InstituteCard({
  id,
  name,
  details,
  image
}: Institute) {
  return (
    <article className="">
      <a
      className="relative grid place-items-center h-48 rounded-2xl bg-black/50 bg-[image:var(--img)] bg-cover bg-center bg-no-repeat bg-blend-darken group"
      href={details}
      style={{ "--img": `url(${image.src})` } as React.CSSProperties}
      >
        <h2 className='text-center font-bold text-lg transition-[translate] group-hover:-translate-y-11'>{name}</h2>
        <div className="absolute flex gap-2 bottom-7 opacity-0 translate-y-7 transition-[opacity,translate] group-hover:opacity-100 group-hover:translate-y-0">
          <span
          className="px-4 py-2 rounded-sm text-white bg-black/40 hover:bg-black/70 active:bg-black/90 transition-colors duration-200 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            window.open(`/${id}/login`, '_self');
          }}
          >
            Login
          </span>
          <span
          className="px-4 py-2 rounded-sm text-white bg-black/40 hover:bg-black/70 active:bg-black/90 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            window.open(`/registro?institute=${id}`, '_self');
          }}
          >
            Registro
          </span>
        </div>
      </a>
    </article>
  );
}
