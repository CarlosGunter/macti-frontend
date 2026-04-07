"use client";

import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import type { getAuthClient } from "@/shared/lib/auth-client";
import { Avatar, AvatarFallback } from "@/shared/shadcn/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/shadcn/components/ui/dropdown-menu";

type AuthSession = NonNullable<
  ReturnType<ReturnType<typeof getAuthClient>["useSession"]>["data"]
>;

interface AutenticatedHeaderProps {
  institute: string;
  authClient: ReturnType<typeof getAuthClient>;
  session: AuthSession;
  isPending: boolean;
}

export function AutenticatedHeader({
  institute,
  authClient,
  session,
  isPending,
}: AutenticatedHeaderProps) {
  const router = useRouter();
  const userInfo = session?.user;
  const initials = userInfo?.name
    ? userInfo.name
        .split(" ")
        .map((n) => n[0].toUpperCase())
        .slice(0, 2)
        .join("")
    : "?";

  if (isPending) return <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="focus:outline-none rounded-full transition-all hover:scale-105"
        >
          <Avatar size="lg">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userInfo?.name || "Usuario"}
            </p>
            {userInfo?.email && (
              <p className="text-xs leading-none text-muted-foreground">
                {userInfo.email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href={`/${institute}/perfil`} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.push(`/${institute}/sign-in`);
                  router.refresh();
                },
              },
            })
          }
          className="cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
