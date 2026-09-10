import { useEffect, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { HomeIndicator, StatusBar } from "@/components/native/status-bar";
import { LockScreen } from "@/components/native/lock-screen";
import { PlatformSwitch } from "@/components/native/platform-switch";
import { TabBar } from "@/components/native/tab-bar";
import { Onboarding } from "@/components/onboarding";
import { useCush } from "@/lib/store";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onboarded = useCush((s) => s.profile.onboarded);
  const unlocked = useCush((s) => s.unlocked);
  const platform = useCush((s) => s.platform);
  const setPlatform = useCush((s) => s.setPlatform);
  const draftStep = useCush((s) => s.draft.step);
  const hydrated = useCush((s) => s.hydrated);

  useEffect(() => {
    const result = useCush.persist.rehydrate();
    const done = () => useCush.getState().setHydrated();
    if (result && typeof (result as Promise<void>).then === "function") {
      void (result as Promise<void>).then(done, done);
    } else {
      done();
    }
  }, []);

  const inverted = !onboarded || !unlocked || draftStep === "receipt";
  const hideNav =
    !onboarded ||
    !unlocked ||
    pathname.startsWith("/send") ||
    pathname.startsWith("/pulse");

  return (
    <div className="min-h-svh bg-ink md:flex md:flex-col md:items-center md:justify-center md:gap-4 md:py-5">
      <div className="hidden md:flex md:flex-col md:items-center md:gap-3">
        <p className="label-kicker text-bone/45">Native preview</p>
        <PlatformSwitch value={platform} onChange={setPlatform} inverted />
      </div>

      <div
        data-platform={platform}
        className={cn(
          "relative mx-auto flex h-svh min-h-svh w-full max-w-phone flex-col overflow-hidden bg-paper text-ink",
          "md:h-[844px] md:max-h-[844px] md:min-h-0 md:shadow-bezel",
          platform === "ios" ? "md:rounded-[48px]" : "md:rounded-[36px]",
        )}
      >
        <StatusBar platform={platform} inverted={inverted} />
        {!hydrated ? (
          <div className="flex flex-1 items-center justify-center bg-paper">
            <p className="text-sm text-stone">Loading Cush…</p>
          </div>
        ) : !onboarded ? (
          <Onboarding />
        ) : !unlocked ? (
          <LockScreen platform={platform} />
        ) : (
          <>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden pt-12 md:pt-14">
              {children}
            </div>
            {!hideNav && <TabBar platform={platform} />}
          </>
        )}
        <HomeIndicator platform={platform} />
      </div>

      <p className="hidden max-w-sm text-center text-xs text-bone/40 md:block">
        Same product on iPhone and Pixel. Chrome follows Human Interface
        Guidelines and Material 3. Not App Store binaries — installable as a
        home-screen app today.
      </p>
    </div>
  );
}
