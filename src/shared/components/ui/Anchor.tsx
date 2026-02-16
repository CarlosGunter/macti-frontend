import Link from "next/link";

interface AnchorProps {
  children: React.ReactNode;
  href: string;
  className?: string;
  variant?: "default" | "secondary";
}

const variants = {
  default:
    "bg-black text-white hover:ring-2 hover:ring-gray-900 dark:bg-gray-200 dark:text-black dark:hover:ring-offset-2 dark:hover:ring-current",
  secondary:
    "bg-transparent border border-gray-400 text-gray-700 dark:hover:ring-offset-1 hover:ring-1 hover:ring-gray-500 dark:text-gray-300 dark:border-gray-600 dark:hover:ring-1 dark:hover:ring-gray-500",
};

export function Anchor({
  children,
  href,
  className = "",
  variant = "default",
}: AnchorProps) {
  return (
    <Link
      href={href}
      className={`flex justify-center items-center gap-2 p-2 rounded-lg transition-shadow duration-200 ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
