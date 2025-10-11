'use client';

import Link from 'next/dist/client/link';
import { StaticImageData } from 'next/image';
import { LoginButton } from './ui/LoginInCardButton';
import { LoginProvider } from '@/shared/providers/LoginContext';

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
      <Link
      className="relative grid place-items-center h-48 rounded-2xl bg-black/50 bg-[image:var(--img)] bg-cover bg-center bg-no-repeat bg-blend-darken group"
      href={details}
      style={{ "--img": `url(${image.src})` } as React.CSSProperties}
      >
        <h2 className='text-center font-bold text-lg transition-[translate] group-hover:-translate-y-11'>{name}</h2>
        <div className="absolute flex gap-2 bottom-7 opacity-0 translate-y-7 transition-[opacity,translate] group-hover:opacity-100 group-hover:translate-y-0">
          <LoginProvider institute={id}>
            <LoginButton />
          </LoginProvider>
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
      </Link>
    </article>
  );
}
