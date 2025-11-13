import { Spinner } from "./Spinner";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  variant?: "recommended" | "danger" | "default";
}

const variants = {
  recommended: "bg-green-700 text-white hover:bg-green-600",
  danger: "bg-red-700 text-white hover:bg-red-600",
  default:
    "bg-black text-white hover:ring-2 hover:ring-gray-900 dark:bg-gray-200 dark:text-black dark:hover:ring-offset-2 dark:hover:ring-current",
};

export default function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  isLoading = false,
  className = "",
  variant = "default",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled || isLoading}
      className={`flex justify-center items-center gap-2 p-2 rounded-lg transition-shadow duration-200 ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${isLoading && "cursor-progress"} ${className}`}
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  );
}
