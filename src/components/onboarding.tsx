import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEND_CURRENCIES, type SendCurrency } from "@/lib/countries";
import { useCush } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Onboarding() {
  const complete = useCush((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("Kwame");
  const [currency, setCurrency] = useState<SendCurrency>("GBP");

  return (
    <div className="flex h-full min-h-0 flex-col bg-ink text-bone">
      <div className="flex-1 overflow-y-auto px-6 pt-16 pb-8">
        <p className="label-kicker text-champagne">Cush Payments</p>
        {step === 0 ? (
          <div className="mt-6">
            <h1 className="font-display text-[2.15rem] leading-[1.1] font-bold tracking-tight text-bone">
              Send money home. They have it before you put the phone down.
            </h1>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-bone-2">
              1.8% fee. No FX markup. You type what they need — we show what you
              pay. Live in every African country.
            </p>
            <ul className="mt-10 space-y-5">
              {[
                ["They receive first", "Think in cedis, naira, shillings — not in what you send."],
                ["Send the usual", "Cush learns the 10th-of-the-month rhythm and offers one tap."],
                ["Pulse", "Rate trend and a plain-English answer: send now, or wait a day."],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-champagne" />
                  <div>
                    <p className="font-semibold text-bone">{t}</p>
                    <p className="text-sm text-bone/65">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-6">
            <h1 className="font-display text-[2.15rem] leading-[1.1] font-bold tracking-tight text-bone">
              What should we call you?
            </h1>
            <p className="mt-3 text-[15px] text-bone-2">
              And where the money leaves from. You can change this later.
            </p>
            <label className="mt-8 block">
              <span className="label-kicker text-bone/55">Your name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 h-14 w-full rounded-lg bg-ink-2 px-4 font-display text-xl font-semibold text-bone outline-none ring-0 placeholder:text-bone/35 focus:shadow-[0_0_0_1px_#e85d04]"
                placeholder="Ama, Kwame, Fatou…"
                autoComplete="given-name"
              />
            </label>
            <p className="label-kicker mt-8 text-bone/55">I send from</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {SEND_CURRENCIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrency(c)}
                  className={cn(
                    "h-12 rounded-full font-semibold tap-press",
                    currency === c
                      ? "bg-champagne text-bone"
                      : "bg-ink-2 text-bone-2",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {step === 0 ? (
          <Button size="lg" block onClick={() => setStep(1)}>
            Continue
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button
            size="lg"
            block
            onClick={() => complete({ firstName: name, sendCurrency: currency })}
          >
            Open Cush
            <ArrowRight className="size-4" />
          </Button>
        )}
        <p className="mt-3 text-center text-xs text-bone/45">
          Licensed to pay out across Africa. 1.8% is the fee — if it is not on
          the screen, we do not charge it.
        </p>
      </div>
    </div>
  );
}
