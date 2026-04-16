import { useState, useCallback, memo } from "react";
import { ArrowLeftRight, Copy, Check } from "lucide-react";
import MathDisplay from "@/components/MathDisplay";
import {
  convertTemperature,
  temperatureUnits,
  temperatureFormulaLatex,
  temperatureExplanation,
  type TemperatureUnit,
} from "./converterData";

const formatNumber = (n: number): string => {
  if (!Number.isFinite(n)) return "—";
  return parseFloat(n.toPrecision(8)).toString();
};

const TemperatureConverter = memo(() => {
  const [from, setFrom] = useState<TemperatureUnit["id"]>("C");
  const [to, setTo] = useState<TemperatureUnit["id"]>("F");
  const [value, setValue] = useState("25");
  const [copied, setCopied] = useState(false);

  const numeric = parseFloat(value);
  const result = Number.isFinite(numeric) ? convertTemperature(numeric, from, to) : NaN;
  const resultText = formatNumber(result);

  const swap = useCallback(() => {
    setFrom(to);
    setTo(from);
  }, [from, to]);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(resultText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [resultText]);

  return (
    <div className="w-full max-w-2xl">
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
              aria-label="Temperatura de entrada"
            />
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value as TemperatureUnit["id"])}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
              aria-label="Escala de origem"
            >
              {temperatureUnits.map((u) => (
                <option key={u.id} value={u.id}>{u.label} — {u.name}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={swap}
            aria-label="Inverter escalas"
            className="mx-auto my-2 flex h-10 w-10 items-center justify-center rounded-full border border-input bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <ArrowLeftRight size={16} />
          </button>

          <div className="flex flex-col gap-2">
            <label className="font-serif-display text-xs uppercase tracking-widest text-muted-foreground">Para</label>
            <div role="status" aria-live="polite" className="input-notebook w-full text-3xl text-foreground">
              {resultText}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={to}
                onChange={(e) => setTo(e.target.value as TemperatureUnit["id"])}
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                aria-label="Escala de destino"
              >
                {temperatureUnits.map((u) => (
                  <option key={u.id} value={u.id}>{u.label} — {u.name}</option>
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
      </div>

      <div className="whiteboard mt-5 border-l-4 border-accent p-5 sm:p-6">
        <h4 className="font-serif-display text-base font-semibold text-primary">Fórmulas</h4>
        <div className="my-3 overflow-x-auto">
          <MathDisplay latex={temperatureFormulaLatex} />
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{temperatureExplanation}</p>
      </div>
    </div>
  );
});

TemperatureConverter.displayName = "TemperatureConverter";

export default TemperatureConverter;
