"use client";

import Image from "next/image";
import MactiLogo from "@/assets/image/logos/macti_logo.png";
import { useLogin } from "@/shared/providers/LoginContext";
import { AutenticatedHeader } from "./AutenticatedHeader";
import { UnauthenticatedHeader } from "./UnauthenticatedHeader";

interface HeaderProps {
  institute: string;
}

export default function Header({ institute }: HeaderProps) {
  const { authenticated } = useLogin();

  return (
    <header className="w-full p-4 flex justify-between items-center mb-4">
      <Image src={MactiLogo.src} alt="Macti Logo" width={80} height={80} />
      {authenticated ? (
        <AutenticatedHeader institute={institute} />
      ) : (
        <UnauthenticatedHeader institute={institute} />
      )}
    </header>
  );
}
