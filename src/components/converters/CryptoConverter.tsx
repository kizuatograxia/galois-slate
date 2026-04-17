import { useState, useCallback, useMemo, useEffect, memo } from "react";
import { ArrowLeftRight, Copy, Check, ArrowUp, ArrowDown } from "lucide-react";
import { useCryptoPrices, useCryptoSparkline, CRYPTO_LIST } from "@/hooks/useCryptoPrices";
import { FIAT_CURRENCIES } from "@/hooks/useCurrencyRates";

const formatPlain = (n: number, digits = 8): string => {
  if (!Number.isFinite(n)) return "—";
  return parseFloat(n.toPrecision(digits)).toString();
};

const Sparkline = memo(({ id }: { id: string }) => {
  const { data, isLoading } = useCryptoSparkline(id);
  if (isLoading || !data || data.length < 2) {
    return <div className="h-12 w-full animate-pulse rounded bg-secondary/40" />;
  }
  const vs = data.map((p) => p.v);
  const min = Math.min(...vs);
  const max = Math.max(...vs);
  const w = 240;
  const h = 48;
  const range = max - min || 1;
  const path = data
    .map((p, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((p.v - min) / range) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
  const trendUp = vs[vs.length - 1] >= vs[0];
  const stroke = trendUp ? "hsl(150, 60%, 45%)" : "hsl(0, 70%, 55%)";

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-12 w-full" preserveAspectRatio="none" aria-label="Variação 7 dias">
      <path d={path} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
});
Sparkline.displayName = "Sparkline";

const CryptoConverter = memo(() => {
  const [cryptoId, setCryptoId] = useState("bitcoin");
  const [fiat, setFiat] = useState<string>("USD");
  const [direction, setDirection] = useState<"crypto-to-fiat" | "fiat-to-crypto">("crypto-to-fiat");
  const [value, setValue] = useState("1");
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const { data, isLoading, isError, dataUpdatedAt } = useCryptoPrices(fiat);

  useEffect(() => {
    setCountdown(30);
    const tick = setInterval(() => {
      setCountdown((c) => (c <= 1 ? 30 : c - 1));
    }, 1000);
    return () => clearInterval(tick);
  }, [dataUpdatedAt]);

  const meta = CRYPTO_LIST.find((c) => c.id === cryptoId)!;
  const fiatMeta = FIAT_CURRENCIES.find((f) => f.code === fiat);
  const price = data?.[cryptoId];
  const rate = price?.price ?? NaN;
  const change = price?.change24h ?? 0;

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (!Number.isFinite(v) || !Number.isFinite(rate)) return NaN;
    return direction === "crypto-to-fiat" ? v * rate : v / rate;
  }, [value, rate, direction]);

  const swap = useCallback(() => {
    setDirection((d) => (d === "crypto-to-fiat" ? "fiat-to-crypto" : "crypto-to-fiat"));
  }, []);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(formatPlain(result)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [result]);

  const cryptoToFiat = direction === "crypto-to-fiat";
  const fromLabel = cryptoToFiat ? `${meta.symbol}` : fiat;
  const toLabel = cryptoToFiat ? fiat : meta.symbol;

  const FiatSelect = ({ ariaLabel, className }: { ariaLabel: string; className?: string }) => (
    <select
      value={fiat}
      onChange={(e) => setFiat(e.target.value)}
      className={`rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 ${className ?? ""}`}
      aria-label={ariaLabel}
    >
      {FIAT_CURRENCIES.map((f) => (
        <option key={f.code} value={f.code}>{f.flag} {f.code} — {f.name}</option>
      ))}
    </select>
  );

  const CryptoSelect = ({ ariaLabel, className }: { ariaLabel: string; className?: string }) => (
    <select
      value={cryptoId}
      onChange={(e) => setCryptoId(e.target.value)}
      className={`rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 ${className ?? ""}`}
      aria-label={ariaLabel}
    >
      {CRYPTO_LIST.map((c) => (
        <option key={c.id} value={c.id}>{c.emoji} {c.symbol} — {c.name}</option>
      ))}
    </select>
  );

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-serif-display text-lg text-primary-foreground">Cripto</h3>
        <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-primary-foreground/70">
          <span className="flex items-center gap-2">
            <span className={`inline-flex h-2 w-2 rounded-full ${isError ? "bg-destructive" : "bg-emerald-400"} ${!isError ? "animate-pulse" : ""}`} aria-hidden />
            {isError ? "Offline" : "Ao Vivo"}
          </span>
          {!isError && <span className="text-primary-foreground/50">próx. {countdown}s</span>}
        </div>
      </div>

      <div className="whiteboard p-5 sm:p-7">
        <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-[1fr_auto_1fr] sm:gap-3">
          <div className="flex flex-col gap-2">
            <label className="font-serif-display text-xs uppercase tracking-widest text-muted-foreground">
              De ({fromLabel})
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="input-notebook w-full text-3xl"
              aria-label="Valor de entrada"
            />
            {cryptoToFiat ? (
              <CryptoSelect ariaLabel="Criptomoeda" />
            ) : (
              <FiatSelect ariaLabel="Moeda fiat" />
            )}
          </div>

          <button
            type="button"
            onClick={swap}
            aria-label="Inverter direção"
            className="mx-auto my-2 flex h-10 w-10 items-center justify-center rounded-full border border-input bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <ArrowLeftRight size={16} />
          </button>

          <div className="flex flex-col gap-2">
            <label className="font-serif-display text-xs uppercase tracking-widest text-muted-foreground">
              Para ({toLabel})
            </label>
            <div role="status" aria-live="polite" className="input-notebook w-full text-3xl text-foreground">
              {isLoading ? <span className="animate-pulse text-muted-foreground/50">…</span> : formatPlain(result)}
            </div>
            <div className="flex items-center gap-2">
              {cryptoToFiat ? (
                <FiatSelect ariaLabel="Moeda fiat de destino" className="flex-1" />
              ) : (
                <CryptoSelect ariaLabel="Criptomoeda de destino" className="flex-1" />
              )}
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

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-chalk text-xl text-foreground">{meta.emoji} {meta.symbol}</span>
            <span className="text-muted-foreground">
              1 {meta.symbol} = {formatPlain(rate, 6)} {fiatMeta?.flag ?? ""} {fiat}
            </span>
            {Number.isFinite(change) && (
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${change >= 0 ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-destructive/15 text-destructive"}`}>
                {change >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                {Math.abs(change).toFixed(2)}%
              </span>
            )}
          </div>
          <div className="w-full sm:w-60">
            <Sparkline id={cryptoId} />
            <div className="mt-1 text-right text-[10px] uppercase tracking-widest text-muted-foreground">7 dias · USD</div>
          </div>
        </div>
      </div>

      <div className="whiteboard mt-5 border-l-4 border-accent p-5 sm:p-6">
        <h4 className="font-serif-display text-base font-semibold text-primary">Dados em tempo real</h4>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Preços e variação de 24 h fornecidos pela API pública do CoinGecko, com atualização automática a cada 30 segundos.
          O sparkline mostra o preço diário em USD nos últimos 7 dias.
        </p>
      </div>
    </div>
  );
});

CryptoConverter.displayName = "CryptoConverter";

export default CryptoConverter;
