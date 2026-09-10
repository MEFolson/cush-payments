import { Link, useRouterState } from "@tanstack/react-router";
import { Activity, ArrowUpRight, House, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/", label: "Home", icon: House, match: (p: string) => p === "/" },
  { to: "/people", label: "People", icon: Users, match: (p: string) => p.startsWith("/people") },
  { to: "/send", label: "Send", icon: ArrowUpRight, match: (p: string) => p.startsWith("/send") },
  { to: "/pulse", label: "Pulse", icon: Activity, match: (p: string) => p.startsWith("/pulse") },
  { to: "/you", label: "You", icon: User, match: (p: string) => p.startsWith("/you") },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav
      className="grid grid-cols-5 border-t border-line bg-surface/95 px-1 pt-1 pb-[max(0.4rem,env(safe-area-inset-bottom))] backdrop-blur-sm"
      aria-label="Main"
    >
      {ITEMS.map((item) => {
        const active = item.match(pathname);
        const Icon = item.icon;
        const isSend = item.to === "/send";
        return (
          <Link
            key={item.to}
            to={item.to}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-md text-[11px] font-semibold",
              active ? "text-champagne" : "text-ash",
            )}
          >
            {isSend ? (
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-full",
                  active ? "bg-champagne text-bone" : "bg-ink text-bone",
                )}
              >
                <Icon className="size-4" strokeWidth={2.4} />
              </span>
            ) : (
              <Icon className="size-5" strokeWidth={active ? 2.4 : 1.8} />
            )}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
