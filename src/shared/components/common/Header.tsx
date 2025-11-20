import Image from "next/image";
import MactiLogo from "@/assets/image/logos/macti_logo.png";
import { LoginButton } from "../ui/LoginButton";

export default function Header() {
  return (
    <header className="w-full p-4 flex justify-between items-center mb-4">
      <Image src={MactiLogo.src} alt="Macti Logo" width={80} height={80} />
      <div>
        <LoginButton />
      </div>
    </header>
  );
}
