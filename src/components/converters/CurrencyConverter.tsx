import { useState, useCallback, useMemo, memo } from "react";
import { ArrowLeftRight, Copy, Check } from "lucide-react";
import { useCurrencyRates, FIAT_CURRENCIES } from "@/hooks/useCurrencyRates";

const formatMoney = (n: number, code: string): string => {
  if (!Number.isFinite(n)) return "—";
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 4,
    }).format(n);
  } catch {
    return n.toFixed(4);
  }
};

const formatPlain = (n: number): string => {
  if (!Number.isFinite(n)) return "—";
  return parseFloat(n.toPrecision(8)).toString();
};

const formatTime = (iso?: string): string => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("pt-BR");
};

const CurrencyConverter = memo(() => {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("BRL");
  const [value, setValue] = useState("1");
  const [copied, setCopied] = useState(false);

  const { data, isLoading, isError, dataUpdatedAt } = useCurrencyRates(from);

  const result = useMemo(() => {
    if (!data) return NaN;
    const rate = data.rates[to];
    const v = parseFloat(value);
    if (!Number.isFinite(v) || !Number.isFinite(rate)) return NaN;
    return v * rate;
  }, [data, to, value]);

  const oneToOne = useMemo(() => {
    if (!data) return NaN;
    return data.rates[to];
  }, [data, to]);

  const swap = useCallback(() => {
    setFrom(to);
    setTo(from);
  }, [from, to]);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(formatPlain(result)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [result]);

  const fromMeta = FIAT_CURRENCIES.find((c) => c.code === from);
  const toMeta = FIAT_CURRENCIES.find((c) => c.code === to);

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-serif-display text-lg text-primary-foreground">Câmbio</h3>
        <div className="flex items-center gap-2">
          <span className={`inline-flex h-2 w-2 rounded-full ${isError ? "bg-destructive" : "bg-emerald-400"} ${!isError ? "animate-pulse" : ""}`} aria-hidden />
          <span className="text-xs uppercase tracking-widest text-primary-foreground/70">
            {isError ? "Offline" : "Ao Vivo"}
          </span>
        </div>
      </div>

      <div className="whiteboard p-5 sm:p-7">
        <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-[1fr_auto_1fr] sm:gap-3">
          <div className="flex flex-col gap-2">
            <label className="font-serif-display text-xs uppercase tracking-widest text-muted-foreground">De</label>
            <input
              type="number"
              inputMode="decimal"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="input-notebook w-full text-3xl"
              aria-label="Valor de entrada"
            />
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
              aria-label="Moeda de origem"
            >
              {FIAT_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={swap}
            aria-label="Inverter moedas"
            className="mx-auto my-2 flex h-10 w-10 items-center justify-center rounded-full border border-input bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <ArrowLeftRight size={16} />
          </button>

          <div className="flex flex-col gap-2">
            <label className="font-serif-display text-xs uppercase tracking-widest text-muted-foreground">Para</label>
            <div role="status" aria-live="polite" className="input-notebook w-full text-3xl text-foreground">
              {isLoading ? <span className="animate-pulse text-muted-foreground/50">…</span> : formatMoney(result, to)}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                aria-label="Moeda de destino"
              >
                {FIAT_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={copy}
                aria-label="Copiar resultado"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          {isError && "Não foi possível atualizar — exibindo último valor em cache."}
          {!isError && data && (
            <>
              {fromMeta?.flag} 1 {from} = {formatPlain(oneToOne)} {to} {toMeta?.flag}
              {" • "}atualizado em {formatTime(new Date(dataUpdatedAt).toISOString())}
            </>
          )}
        </p>
      </div>

      <div className="whiteboard mt-5 border-l-4 border-accent p-5 sm:p-6">
        <h4 className="font-serif-display text-base font-semibold text-primary">Sobre o câmbio</h4>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          As cotações vêm da exchangerate-api.com (atualização indicativa, não para uso financeiro).
          O cache local é renovado a cada 5 minutos para reduzir requisições.
        </p>
      </div>
    </div>
  );
});

CurrencyConverter.displayName = "CurrencyConverter";

export default CurrencyConverter;
