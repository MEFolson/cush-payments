import { useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OCCUPATIONS, SOURCE_OF_FUNDS, DEMO_PASSCODE } from "@/lib/compliance";
import { SEND_CURRENCIES, type SendCurrency } from "@/lib/countries";
import { useCush } from "@/lib/store";
import { cn } from "@/lib/utils";

const STEPS = 5;

export function Onboarding() {
  const complete = useCush((s) => s.completeOnboarding);
  const platform = useCush((s) => s.platform);
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState("Kwame");
  const [lastName, setLastName] = useState("Mensah");
  const [dob, setDob] = useState("1992-04-18");
  const [city, setCity] = useState("London");
  const [nationality, setNationality] = useState("GB");
  const [occupation, setOccupation] = useState<(typeof OCCUPATIONS)[number]>("Employed");
  const [source, setSource] = useState<(typeof SOURCE_OF_FUNDS)[number]>("Salary");
  const [currency, setCurrency] = useState<SendCurrency>("GBP");
  const [passcode, setPasscode] = useState("");
  const [confirm, setConfirm] = useState("");
  const [biometrics, setBiometrics] = useState(true);

  function next() {
    if (step < STEPS - 1) setStep((s) => s + 1);
    else {
      complete({
        firstName,
        lastName,
        sendCurrency: currency,
        city,
        nationality,
        occupation,
        sourceOfFunds: source,
        dob,
        passcode: passcode.length === 4 ? passcode : DEMO_PASSCODE,
        biometrics,
      });
    }
  }

  const canNext =
    step === 0
      ? true
      : step === 1
        ? firstName.trim().length > 1 && lastName.trim().length > 1 && dob.length === 10
        : step === 2
          ? city.trim().length > 1
          : step === 3
            ? true
            : passcode.length === 0 || (passcode.length === 4 && (confirm === passcode || confirm.length === 0));

  return (
    <div className="flex h-full min-h-0 flex-col bg-ink text-bone">
      <div className="flex-1 overflow-y-auto px-6 pt-16 pb-6">
        <div className="flex gap-1.5" aria-hidden>
          {Array.from({ length: STEPS }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full",
                i <= step ? "bg-champagne" : "bg-ink-2",
              )}
            />
          ))}
        </div>

        {step === 0 && (
          <div className="mt-8">
            <p className="label-kicker text-champagne">Licensed · Africa-wide</p>
            <h1 className="mt-4 font-display text-[2.05rem] leading-[1.1] font-bold tracking-tight">
              Send money home the way a bank would ship it.
            </h1>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-bone/70">
              Identity first. Rate locked. Strong customer authentication on
              every send. 1.8% fee, no FX markup, live in all 54 African
              countries.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                ["KYC before the first send", "Name, date of birth, occupation — the same pack a PSP files."],
                ["They receive first", "Type cedis, naira, shillings. We reverse-quote what you pay."],
                ["SCA on confirm", "Face ID, fingerprint or passcode. PSD2-style step-up."],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-3">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-champagne" />
                  <div>
                    <p className="font-semibold">{t}</p>
                    <p className="text-sm text-bone/60">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {step === 1 && (
          <div className="mt-8">
            <p className="label-kicker text-champagne">Identity</p>
            <h1 className="mt-3 font-display text-[1.85rem] font-bold tracking-tight">
              Legal name
            </h1>
            <p className="mt-2 text-sm text-bone/65">
              As it appears on your passport or driving licence.
            </p>
            <label className="mt-6 block">
              <span className="label-kicker text-bone/45">First name</span>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-2 h-14 w-full rounded-lg bg-ink-2 px-4 font-display text-xl font-semibold outline-none"
                autoComplete="given-name"
              />
            </label>
            <label className="mt-4 block">
              <span className="label-kicker text-bone/45">Last name</span>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-2 h-14 w-full rounded-lg bg-ink-2 px-4 font-display text-xl font-semibold outline-none"
                autoComplete="family-name"
              />
            </label>
            <label className="mt-4 block">
              <span className="label-kicker text-bone/45">Date of birth</span>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="mt-2 h-14 w-full rounded-lg bg-ink-2 px-4 text-base font-semibold outline-none"
              />
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="mt-8">
            <p className="label-kicker text-champagne">Residency</p>
            <h1 className="mt-3 font-display text-[1.85rem] font-bold tracking-tight">
              Where you live
            </h1>
            <p className="mt-2 text-sm text-bone/65">
              Used for source-of-funds and corridor licensing.
            </p>
            <label className="mt-6 block">
              <span className="label-kicker text-bone/45">City</span>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-2 h-14 w-full rounded-lg bg-ink-2 px-4 font-display text-xl font-semibold outline-none"
              />
            </label>
            <p className="label-kicker mt-6 text-bone/45">Nationality</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                ["GB", "UK"],
                ["US", "US"],
                ["EU", "EU"],
              ].map(([code, label]) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setNationality(code)}
                  className={cn(
                    "h-12 rounded-full font-semibold tap-press",
                    nationality === code ? "bg-champagne text-bone" : "bg-ink-2 text-bone-2",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="label-kicker mt-6 text-bone/45">I send from</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {SEND_CURRENCIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrency(c)}
                  className={cn(
                    "h-12 rounded-full font-semibold tap-press",
                    currency === c ? "bg-champagne text-bone" : "bg-ink-2 text-bone-2",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mt-8">
            <p className="label-kicker text-champagne">Source of funds</p>
            <h1 className="mt-3 font-display text-[1.85rem] font-bold tracking-tight">
              How you earn
            </h1>
            <p className="mt-2 text-sm text-bone/65">
              Required under UK MLRs / FATF for remittance above a threshold.
              This is a demo capture.
            </p>
            <p className="label-kicker mt-6 text-bone/45">Occupation</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {OCCUPATIONS.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => setOccupation(o)}
                  className={cn(
                    "h-12 rounded-full text-sm font-semibold tap-press",
                    occupation === o ? "bg-champagne text-bone" : "bg-ink-2 text-bone-2",
                  )}
                >
                  {o}
                </button>
              ))}
            </div>
            <p className="label-kicker mt-6 text-bone/45">Money comes from</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {SOURCE_OF_FUNDS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSource(s)}
                  className={cn(
                    "h-12 rounded-full text-sm font-semibold tap-press",
                    source === s ? "bg-champagne text-bone" : "bg-ink-2 text-bone-2",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="mt-8">
            <p className="label-kicker text-champagne">Device security</p>
            <h1 className="mt-3 font-display text-[1.85rem] font-bold tracking-tight">
              App lock
            </h1>
            <p className="mt-2 text-sm text-bone/65">
              Four digits plus {platform === "ios" ? "Face ID" : "fingerprint"} for
              every send above a penny.
            </p>
            <label className="mt-6 block">
              <span className="label-kicker text-bone/45">Passcode</span>
              <input
                inputMode="numeric"
                maxLength={4}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder={DEMO_PASSCODE}
                className="mt-2 h-14 w-full rounded-lg bg-ink-2 px-4 font-mono text-2xl tracking-[0.4em] outline-none"
              />
            </label>
            <label className="mt-4 block">
              <span className="label-kicker text-bone/45">Confirm</span>
              <input
                inputMode="numeric"
                maxLength={4}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value.replace(/\D/g, "").slice(0, 4))}
                className="mt-2 h-14 w-full rounded-lg bg-ink-2 px-4 font-mono text-2xl tracking-[0.4em] outline-none"
              />
            </label>
            {confirm.length === 4 && confirm !== passcode && (
              <p className="mt-2 text-xs text-destructive">Passcodes do not match.</p>
            )}
            <button
              type="button"
              onClick={() => setBiometrics(!biometrics)}
              className="mt-6 flex w-full items-center justify-between rounded-lg bg-ink-2 px-4 py-4 text-left"
            >
              <span>
                <span className="block font-semibold">
                  {platform === "ios" ? "Face ID" : "Fingerprint"}
                </span>
                <span className="text-xs text-bone/55">Unlock and confirm sends</span>
              </span>
              <span
                className={cn(
                  "flex h-7 w-12 items-center rounded-full p-1",
                  biometrics ? "bg-champagne" : "bg-stone",
                )}
              >
                <span
                  className={cn(
                    "size-5 rounded-full bg-bone transition-transform duration-150",
                    biometrics ? "translate-x-5" : "translate-x-0",
                  )}
                />
              </span>
            </button>
          </div>
        )}
      </div>

      <div className="px-6 pb-8">
        <Button size="lg" block disabled={!canNext} onClick={next}>
          {step === 0 ? "Verify identity" : step === STEPS - 1 ? "Enter Cush" : "Continue"}
          <ArrowRight className="size-4" />
        </Button>
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="mt-3 h-11 w-full text-sm font-semibold text-bone/55"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}
