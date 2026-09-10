import { useEffect, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { BottomNav } from "@/components/bottom-nav";
import { Onboarding } from "@/components/onboarding";
import { useCush } from "@/lib/store";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onboarded = useCush((s) => s.profile.onboarded);
  const draftStep = useCush((s) => s.draft.step);

  useEffect(() => {
    const result = useCush.persist.rehydrate();
    const done = () => useCush.getState().setHydrated();
    if (result && typeof (result as Promise<void>).then === "function") {
      void (result as Promise<void>).then(done, done);
    } else {
      done();
    }
  }, []);

  const hideNav =
    (pathname.startsWith("/send") && draftStep !== "compose") || !onboarded;

  return (
    <div className="min-h-svh bg-ink md:flex md:items-center md:justify-center md:py-6">
      <div className="relative mx-auto flex h-svh min-h-svh w-full max-w-phone flex-col overflow-hidden bg-paper text-ink md:rounded-xl md:shadow-lift">
        {!onboarded ? (
          <Onboarding />
        ) : (
          <>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
            {!hideNav && <BottomNav />}
          </>
        )}
      </div>
    </div>
  );
}
