import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Clock3, House, Plus, User, Users } from "lucide-react";
import type { Platform } from "@/lib/platform";
import { useCush } from "@/lib/store";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/", label: "Home", icon: House, match: (p: string) => p === "/" },
  {
    to: "/activity",
    label: "Activity",
    icon: Clock3,
    match: (p: string) => p.startsWith("/activity"),
  },
  {
    to: "/people",
    label: "People",
    icon: Users,
    match: (p: string) => p.startsWith("/people"),
  },
  { to: "/you", label: "You", icon: User, match: (p: string) => p.startsWith("/you") },
] as const;

export function TabBar({ platform }: { platform: Platform }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const resetDraft = useCush((s) => s.resetDraft);

  function send() {
    resetDraft();
    void navigate({ to: "/send" });
  }

  const showFab =
    platform === "android" &&
    (pathname === "/" || pathname.startsWith("/activity") || pathname.startsWith("/people"));

  if (platform === "android") {
    return (
      <nav
        className="relative grid grid-cols-4 border-t border-line bg-surface px-1 pb-3 pt-1"
        aria-label="Main"
      >
        {TABS.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-lg text-[11px] font-semibold",
                active ? "text-champagne" : "text-ash",
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-16 items-center justify-center rounded-full",
                  active && "bg-champagne/12",
                )}
              >
                <Icon className="size-5" strokeWidth={active ? 2.4 : 1.8} />
              </span>
              {item.label}
            </Link>
          );
        })}
        {showFab && (
        <button
          type="button"
          onClick={send}
          aria-label="New send"
          className="absolute -top-7 right-5 flex size-14 items-center justify-center rounded-2xl bg-champagne text-bone shadow-cta tap-press"
        >
          <Plus className="size-6" strokeWidth={2.4} />
        </button>
        )}
      </nav>
    );
  }

  return (
    <nav
      className="grid grid-cols-4 border-t border-line bg-surface/95 px-1 pt-1 pb-4 backdrop-blur-sm"
      aria-label="Main"
    >
      {TABS.map((item) => {
        const active = item.match(pathname);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-12 flex-col items-center justify-center gap-0.5 text-[10px] font-semibold",
              active ? "text-champagne" : "text-ash",
            )}
          >
            <Icon className="size-6" strokeWidth={active ? 2.3 : 1.7} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
