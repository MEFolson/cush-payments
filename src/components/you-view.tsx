import { SEND_CURRENCIES, type SendCurrency } from "@/lib/countries";
import { formatMoney } from "@/lib/format";
import { FEE_RATE } from "@/lib/quote";
import { useCush } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";
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
  const transfers = useCush((s) => s.transfers);
  const setSendCurrency = useCush((s) => s.setSendCurrency);
  const resetDemo = useCush((s) => s.resetDemo);
  const sent = transfers.reduce((s, t) => s + t.sendAmount, 0);
  const fees = transfers.reduce((s, t) => s + t.fee, 0);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pt-5 pb-8">
      <p className="label-kicker text-champagne">You</p>
      <div className="mt-3 flex items-center gap-3">
        <PersonAvatar name={profile.firstName} size={56} />
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            {profile.firstName}
          </h1>
          <p className="text-sm text-stone">{profile.city} · sending home</p>
        </div>
      </div>

      <section className="mt-6 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-surface p-4 shadow-border">
          <p className="text-xs text-ash">Sent with Cush</p>
          <p className="mt-1 font-display text-lg font-semibold tabular">
            {formatMoney(sent, profile.sendCurrency, { compact: true })}
          </p>
        </div>
        <div className="rounded-lg bg-surface p-4 shadow-border">
          <p className="text-xs text-ash">Fees at 1.8%</p>
          <p className="mt-1 font-display text-lg font-semibold tabular">
            {formatMoney(fees, profile.sendCurrency)}
          </p>
        </div>
      </section>

      <section className="mt-6">
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

      <section className="mt-6 rounded-xl bg-ink p-5 text-bone">
        <p className="label-kicker text-champagne">The fee</p>
        <p className="mt-2 font-display text-3xl font-bold">{(FEE_RATE * 100).toFixed(1)}%</p>
        <p className="mt-2 text-sm text-bone-2">
          Mid-market FX. No inbound fee on the wallet. If it is not on the
          screen before you send, we do not charge it.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-base font-semibold">Licensed, live, Africa-wide</h2>
        <p className="mt-1 text-sm text-stone">
          Payouts to all 54 African countries — mobile money and bank. Built on
          Cush Core.
        </p>
        <ul className="mt-3 divide-y divide-line overflow-hidden rounded-lg bg-surface shadow-border">
          {LICENCES.map((l) => (
            <li key={l.place} className="px-4 py-3">
              <p className="text-sm font-semibold">{l.place}</p>
              <p className="text-xs text-stone">{l.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-base font-semibold">How Cush is different</h2>
        <ul className="mt-3 space-y-3 text-sm text-stone">
          <li>
            <span className="font-semibold text-ink">They-receive first.</span>{" "}
            Type what mum needs in cedis. We reverse-quote what you pay.
          </li>
          <li>
            <span className="font-semibold text-ink">Send the usual.</span>{" "}
            The 10th-of-the-month rent is one tap, not a seven-screen form.
          </li>
          <li>
            <span className="font-semibold text-ink">Pulse.</span> Rate
            trend plus a plain answer — send now, or wait a day.
          </li>
          <li>
            <span className="font-semibold text-ink">Ask Cush.</span> “Send
            2,000 cedis to Ama for rent” fills the send for you.
          </li>
        </ul>
      </section>

      <p className="mt-8 text-xs text-ash">
        Cush Payments · Africa’s payment platform. Add this app to your iPhone
        or Android home screen from the browser share menu.
      </p>
      <Button variant="outline" className="mt-4" onClick={() => resetDemo()}>
        Reset demo data
      </Button>
    </div>
  );
}
