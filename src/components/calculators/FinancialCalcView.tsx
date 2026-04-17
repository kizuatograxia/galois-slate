import { useState } from "react";

type Tab = "compound" | "pmt" | "savings";

interface FieldProps {
  label: string;
  value: string;
  unit?: string;
  onChange: (v: string) => void;
}

const Field = ({ label, value, unit, onChange }: FieldProps) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
      {label}
    </label>
    <div className="flex items-center gap-1">
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="0"
        className="input-notebook w-full text-left font-chalk text-xl px-2 py-1"
      />
      {unit && <span className="text-sm text-muted-foreground shrink-0">{unit}</span>}
    </div>
  </div>
);

const Result = ({ label, value }: { label: string; value: string }) => (
  <div className="mt-4 rounded-lg border border-accent/30 bg-secondary p-4 text-center">
    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
    <p className="font-chalk text-3xl text-foreground">{value}</p>
  </div>
);

const fmt = (n: number) =>
  isFinite(n) && !isNaN(n)
    ? n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : "—";

/* ── Tabs ─────────────────────────────────────────────────────────── */

const CompoundInterest = () => {
  const [P, setP] = useState("");
  const [i, setI] = useState("");
  const [n, setN] = useState("");

  const M = parseFloat(P) * Math.pow(1 + parseFloat(i) / 100, parseFloat(n));
  const juros = M - parseFloat(P);

  return (
    <div className="space-y-3">
      <p className="font-chalk text-center text-lg text-muted-foreground">M = P·(1 + i)ⁿ</p>
      <Field label="Principal (P)" value={P} unit="R$" onChange={setP} />
      <Field label="Taxa por período (i)" value={i} unit="%" onChange={setI} />
      <Field label="Períodos (n)" value={n} onChange={setN} />
      {P && i && n && (
        <Result label="Montante final" value={fmt(M)} />
      )}
      {P && i && n && isFinite(M) && (
        <p className="text-center text-sm text-muted-foreground mt-1">
          Juros: <span className="font-chalk text-foreground">{fmt(juros)}</span>
        </p>
      )}
    </div>
  );
};

const PMTCalc = () => {
  const [PV, setPV] = useState("");
  const [i, setI]   = useState("");
  const [n, setN]   = useState("");

  const rate = parseFloat(i) / 100;
  const nv = parseFloat(n);
  const pv = parseFloat(PV);
  const PMT = (rate === 0) ? pv / nv : pv * rate / (1 - Math.pow(1 + rate, -nv));

  return (
    <div className="space-y-3">
      <p className="font-chalk text-center text-lg text-muted-foreground">
        PMT = PV · i / (1−(1+i)⁻ⁿ)
      </p>
      <Field label="Valor presente (PV)" value={PV} unit="R$" onChange={setPV} />
      <Field label="Taxa por período (i)" value={i} unit="%" onChange={setI} />
      <Field label="Períodos (n)" value={n} onChange={setN} />
      {PV && i && n && (
        <Result label="Prestação mensal (PMT)" value={fmt(PMT)} />
      )}
    </div>
  );
};

const SavingsGoal = () => {
  const [PMT, setPMT] = useState("");
  const [i, setI]     = useState("");
  const [n, setN]     = useState("");

  const rate = parseFloat(i) / 100;
  const nv = parseFloat(n);
  const pmt = parseFloat(PMT);
  const FV = (rate === 0) ? pmt * nv : pmt * (Math.pow(1 + rate, nv) - 1) / rate;

  return (
    <div className="space-y-3">
      <p className="font-chalk text-center text-lg text-muted-foreground">
        FV = PMT·((1+i)ⁿ−1)/i
      </p>
      <Field label="Aporte mensal (PMT)" value={PMT} unit="R$" onChange={setPMT} />
      <Field label="Taxa por período (i)" value={i} unit="%" onChange={setI} />
      <Field label="Meses (n)" value={n} onChange={setN} />
      {PMT && i && n && (
        <Result label="Valor futuro (FV)" value={fmt(FV)} />
      )}
    </div>
  );
};

/* ── Main Component ────────────────────────────────────────────────── */

const TABS: { key: Tab; label: string }[] = [
  { key: "compound", label: "Juros Compostos" },
  { key: "pmt",      label: "Prestação" },
  { key: "savings",  label: "Meta" },
];

const FinancialCalcView = () => {
  const [tab, setTab] = useState<Tab>("compound");

  return (
    <div className="whiteboard p-4 sm:p-6 w-full max-w-sm mx-auto">
      {/* Tab bar */}
      <div className="flex rounded-lg overflow-hidden border border-border mb-5">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2 text-xs font-medium transition-all ${
              tab === t.key
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "compound" && <CompoundInterest />}
      {tab === "pmt"      && <PMTCalc />}
      {tab === "savings"  && <SavingsGoal />}
    </div>
  );
};

export default FinancialCalcView;
