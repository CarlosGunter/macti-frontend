import MactiLogo from "@/assets/image/logos/macti_logo.png";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full p-4 flex justify-between items-center mb-4">
      <img src={MactiLogo.src} alt="Macti Logo" />
      <div>
        <Link href="/login" className="px-4 py-2 bg-white text-black rounded">
          Login
        </Link>
      </div>
    </header>
  );
}