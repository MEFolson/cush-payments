import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Flag } from "@/components/flag";
import { PersonAvatar } from "@/components/person-avatar";
import { Sheet } from "@/components/sheet";
import { Button } from "@/components/ui/button";
import { COUNTRIES, countryByIso } from "@/lib/countries";
import { formatMoney } from "@/lib/format";
import { useCush } from "@/lib/store";
import { cn } from "@/lib/utils";

export function PeopleView() {
  const navigate = useNavigate();
  const people = useCush((s) => s.people);
  const startUsual = useCush((s) => s.startUsual);
  const addPerson = useCush((s) => s.addPerson);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("Family");
  const [iso2, setIso2] = useState("gh");
  const [railId, setRailId] = useState("mtn");
  const [account, setAccount] = useState("");
  const [usual, setUsual] = useState("1000");

  const country = countryByIso(iso2);

  function save() {
    if (!name.trim() || !country) return;
    const id = addPerson({
      name: name.trim(),
      relation: relation.trim() || "Family",
      iso2,
      railId: country.rails.some((r) => r.id === railId)
        ? railId
        : country.rails[0]!.id,
      account: account.trim() || `${country.rails[0]?.name} · saved`,
      usualReceive: Number(usual) || 0,
      usualPurpose: "Family",
      cadenceDay: new Date().getDate(),
    });
    setOpen(false);
    setName("");
    setAccount("");
    startUsual(id);
    void navigate({ to: "/send" });
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto">
      <header className="flex items-end justify-between px-5 pt-5 pb-3">
        <div>
          <p className="label-kicker text-champagne">People</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight">
            Who you send to
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex size-11 items-center justify-center rounded-full bg-ink text-bone tap-press"
          aria-label="Add person"
        >
          <Plus className="size-5" />
        </button>
      </header>
      <p className="px-5 text-sm text-stone">
        Tap a person to send their usual. Cush remembers the rail, the amount and
        the day.
      </p>
      <div className="mt-4 space-y-2 px-5 pb-8">
        {people.map((p) => {
          const c = countryByIso(p.iso2);
          const rail = c?.rails.find((r) => r.id === p.railId);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                startUsual(p.id);
                void navigate({ to: "/send" });
              }}
              className="flex w-full items-center gap-3 rounded-lg bg-surface px-3 py-3 text-left shadow-border tap-press"
            >
              <PersonAvatar name={p.name} size={48} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{p.name}</p>
                <p className="flex items-center gap-1.5 text-xs text-stone">
                  <Flag iso2={p.iso2} size={14} />
                  {p.relation} · {rail?.name}
                </p>
                <p className="mt-0.5 truncate text-xs text-ash">{p.account}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold tabular">
                  {c ? formatMoney(p.usualReceive, c.currency, { compact: true }) : ""}
                </p>
                <p className="text-[11px] text-ash">Usual · {p.usualPurpose}</p>
              </div>
            </button>
          );
        })}
      </div>

      <Sheet open={open} onClose={() => setOpen(false)} title="Add someone" tall>
        <label className="block">
          <span className="text-xs font-semibold text-stone">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 h-12 w-full rounded-lg bg-paper px-3 shadow-border outline-none"
            placeholder="Full name"
          />
        </label>
        <label className="mt-3 block">
          <span className="text-xs font-semibold text-stone">Relation</span>
          <input
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
            className="mt-1 h-12 w-full rounded-lg bg-paper px-3 shadow-border outline-none"
            placeholder="Mum, brother, team…"
          />
        </label>
        <p className="mt-3 text-xs font-semibold text-stone">Country</p>
        <div className="mt-1 flex max-h-40 flex-col gap-1 overflow-y-auto rounded-lg bg-paper p-1 shadow-border">
          {COUNTRIES.map((c) => (
            <button
              key={c.iso2}
              type="button"
              onClick={() => {
                setIso2(c.iso2);
                setRailId(c.rails[0]!.id);
              }}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-2 text-left text-sm",
                iso2 === c.iso2 ? "bg-bone-2 font-semibold" : "",
              )}
            >
              <Flag iso2={c.iso2} size={18} />
              {c.name}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs font-semibold text-stone">Payout</p>
        <div className="mt-1 flex flex-wrap gap-2">
          {country?.rails.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRailId(r.id)}
              className={cn(
                "h-9 rounded-full px-3 text-sm font-medium",
                railId === r.id ? "bg-ink text-bone" : "bg-paper shadow-border",
              )}
            >
              {r.name}
            </button>
          ))}
        </div>
        <label className="mt-3 block">
          <span className="text-xs font-semibold text-stone">Wallet or account</span>
          <input
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className="mt-1 h-12 w-full rounded-lg bg-paper px-3 shadow-border outline-none"
            placeholder="Number or IBAN"
          />
        </label>
        <label className="mt-3 block">
          <span className="text-xs font-semibold text-stone">
            Usual amount they receive ({country?.currency})
          </span>
          <input
            value={usual}
            onChange={(e) => setUsual(e.target.value)}
            inputMode="decimal"
            className="mt-1 h-12 w-full rounded-lg bg-paper px-3 shadow-border outline-none"
          />
        </label>
        <Button block className="mt-5" onClick={save} disabled={!name.trim()}>
          Save and send
        </Button>
      </Sheet>
    </div>
  );
}
