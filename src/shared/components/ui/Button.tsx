interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  variant?: "recommended" | "danger" | "default";
}

const variants = {
  recommended: "bg-green-700 text-white hover:bg-green-600",
  danger: "bg-red-700 text-white hover:bg-red-600",
  default: "bg-gray-200 text-black hover:bg-gray-300",
};

export default function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  variant = "default",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`p-2 rounded-lg transition-colors duration-200 ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
