import MactiLogo from "@/assets/image/logos/macti_logo.png";

export default function Header() {
  return (
    <header className="w-full p-4 flex justify-between items-center border-b mb-4">
      <img src={MactiLogo.src} alt="Macti Logo" />
      <div>
        <a href="/login" className="px-4 py-2 bg-blue-500 text-white rounded">
          Login
        </a>
      </div>
    </header>
  );
}