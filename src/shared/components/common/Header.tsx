import Image from "next/image";
import Link from "next/link";
import MactiLogo from "@/assets/image/logos/macti_logo.png";

export default function Header() {
  return (
    <header className="w-full p-4 flex justify-between items-center mb-4">
      <Image src={MactiLogo.src} alt="Macti Logo" width={80} height={80} />
      <div>
        <Link href="/login" className="px-4 py-2 bg-white text-black rounded">
          Login
        </Link>
      </div>
    </header>
  );
}
