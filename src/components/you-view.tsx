import { ShieldCheck } from "lucide-react";
import { PlatformSwitch } from "@/components/native/platform-switch";
import { PersonAvatar } from "@/components/person-avatar";
import { Button } from "@/components/ui/button";
import { LIMITS, spendInDays } from "@/lib/compliance";
import { SEND_CURRENCIES, type SendCurrency } from "@/lib/countries";
import { formatMoney } from "@/lib/format";
import { FEE_RATE } from "@/lib/quote";
import { useCush } from "@/lib/store";
import { cn } from "@/lib/utils";

const LICENCES = [
  { place: "United Kingdom", body: "FCA authorised payment institution" },
  { place: "Ghana", body: "Bank of Ghana Payment Service Provider" },
  { place: "Nigeria", body: "CBN International Money Transfer" },
  { place: "Kenya", body: "CBK money remittance operator" },
  { place: "South Africa", body: "SARB ADLA" },
  { place: "West Africa", body: "BCEAO EMI / SFD corridors" },
  { place: "Central Africa", body: "BEAC regional payout" },
  { place: "Continent", body: "PAPSS participant · local-currency settlement" },
];

export function YouView() {
  const profile = useCush((s) => s.profile);
  const platform = useCush((s) => s.platform);
  const setPlatform = useCush((s) => s.setPlatform);
  const transfers = useCush((s) => s.transfers);
  const setSendCurrency = useCush((s) => s.setSendCurrency);
  const setBiometrics = useCush((s) => s.setBiometrics);
  const lock = useCush((s) => s.lock);
  const resetDemo = useCush((s) => s.resetDemo);
  const sent = transfers.reduce((s, t) => s + t.sendAmount, 0);
  const fees = transfers.reduce((s, t) => s + t.fee, 0);
  const day = spendInDays(transfers, 1, profile.sendCurrency);
  const month = spendInDays(transfers, 30, profile.sendCurrency);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pt-2 pb-10">
      <p className="label-kicker text-champagne">You</p>
      <div className="mt-3 flex items-center gap-3">
        <PersonAvatar name={`${profile.firstName} ${profile.lastName}`} size={56} />
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-bold tracking-tight">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="flex items-center gap-1 text-sm text-stone">
            {profile.kycVerified && <ShieldCheck className="size-4 text-success" />}
            {profile.kycVerified ? "Identity verified" : "Unverified"} · {profile.city}
          </p>
        </div>
      </div>

      <section className="mt-5">
        <p className="text-xs font-semibold text-stone">Preview as</p>
        <div className="mt-2">
          <PlatformSwitch value={platform} onChange={setPlatform} />
        </div>
        <p className="mt-2 text-xs text-ash">
          iPhone uses large titles and a tab bar. Pixel uses Material 3 navigation
          and a send FAB.
        </p>
      </section>

      <section className="mt-5 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-surface p-4 shadow-border">
          <p className="text-xs text-ash">Sent with Cush</p>
          <p className="mt-1 font-display text-lg font-semibold tabular">
            {formatMoney(sent, profile.sendCurrency, { compact: true })}
          </p>
        </div>
        <div className="rounded-xl bg-surface p-4 shadow-border">
          <p className="text-xs text-ash">Fees at 1.8%</p>
          <p className="mt-1 font-display text-lg font-semibold tabular">
            {formatMoney(fees, profile.sendCurrency)}
          </p>
        </div>
      </section>

      <section className="mt-5 rounded-xl bg-surface p-4 shadow-border">
        <p className="text-sm font-semibold">Send limits</p>
        <LimitBar
          label="Today"
          used={day}
          cap={LIMITS.daily}
          code={profile.sendCurrency}
        />
        <LimitBar
          label="30 days"
          used={month}
          cap={LIMITS.monthly}
          code={profile.sendCurrency}
        />
        <p className="mt-2 text-[11px] text-ash">
          Single send cap {LIMITS.single.toLocaleString("en-GB")} {profile.sendCurrency}.
          Raise via extra KYC.
        </p>
      </section>

      <section className="mt-5">
        <h2 className="font-display text-base font-semibold">I send from</h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {SEND_CURRENCIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSendCurrency(c as SendCurrency)}
              className={cn(
                "h-11 rounded-full text-sm font-semibold tap-press",
                profile.sendCurrency === c
                  ? "bg-ink text-bone"
                  : "bg-surface text-ink shadow-border",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-xl bg-surface shadow-border">
        <button
          type="button"
          onClick={() => setBiometrics(!profile.biometrics)}
          className="flex w-full items-center justify-between px-4 py-4 text-left"
        >
          <span>
            <span className="block text-sm font-semibold">
              {platform === "ios" ? "Face ID" : "Fingerprint"}
            </span>
            <span className="text-xs text-stone">Unlock and confirm sends</span>
          </span>
          <span
            className={cn(
              "flex h-7 w-12 items-center rounded-full p-1",
              profile.biometrics ? "bg-champagne" : "bg-bone-2",
            )}
          >
            <span
              className={cn(
                "size-5 rounded-full bg-surface shadow-border transition-transform duration-150",
                profile.biometrics ? "translate-x-5" : "translate-x-0",
              )}
            />
          </span>
        </button>
        <div className="border-t border-line px-4 py-3 text-sm text-stone">
          Occupancy {profile.occupation} · funds from {profile.sourceOfFunds}
        </div>
      </section>

      <section className="mt-5 rounded-[20px] bg-ink p-5 text-bone">
        <p className="label-kicker text-champagne">The fee</p>
        <p className="mt-2 font-display text-3xl font-bold">{(FEE_RATE * 100).toFixed(1)}%</p>
        <p className="mt-2 text-sm text-bone/70">
          Mid-market FX. No inbound fee on the wallet. If it is not on the screen
          before you send, we do not charge it.
        </p>
      </section>

      <section className="mt-5">
        <h2 className="font-display text-base font-semibold">Licensed, live, Africa-wide</h2>
        <ul className="mt-3 divide-y divide-line overflow-hidden rounded-xl bg-surface shadow-border">
          {LICENCES.map((l) => (
            <li key={l.place} className="px-4 py-3">
              <p className="text-sm font-semibold">{l.place}</p>
              <p className="text-xs text-stone">{l.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-6 flex flex-col gap-2">
        <Button variant="outline" block onClick={() => lock()}>
          Lock app
        </Button>
        <Button variant="ghost" block onClick={() => resetDemo()}>
          Reset demo data
        </Button>
      </div>
      <p className="mt-4 text-xs text-ash">
        Cush Payments. Add to iPhone or Android from the browser share menu.
        Native store binaries ship with live rails and Apple/Google review.
      </p>
    </div>
  );
}

function LimitBar({
  label,
  used,
  cap,
  code,
}: {
  label: string;
  used: number;
  cap: number;
  code: string;
}) {
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-stone">
        <span>{label}</span>
        <span className="font-mono tabular">
          {formatMoney(used, code)} / {cap.toLocaleString("en-GB")}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-bone-2">
        <div
          className="h-full rounded-full bg-champagne"
          style={{ width: `${Math.min(100, (used / cap) * 100)}%` }}
        />
      </div>
    </div>
  );
}
