import { useState } from "react";
import { motion } from "framer-motion";
import MathDisplay from "./MathDisplay";

interface Props {
  degree: number;
  coeffs: number[];
  roots: { real: number; imag: number }[];
}

function fmtN(v: number): string {
  if (Math.abs(v) < 1e-9) return "0";
  return parseFloat(v.toPrecision(6)).toString();
}

/** Build a LaTeX polynomial string from quotient coefficients */
function quotientLatex(quot: number[], deg: number): string {
  const parts: string[] = [];
  quot.forEach((c, i) => {
    if (Math.abs(c) < 1e-9) return;
    const exp = deg - i;
    const absC = Math.abs(c);
    const sign = parts.length === 0 ? (c < 0 ? "-" : "") : c < 0 ? " - " : " + ";
    const cStr = absC === 1 && exp > 0 ? "" : fmtN(absC);
    const xStr = exp === 0 ? "" : exp === 1 ? "x" : `x^{${exp}}`;
    parts.push(`${sign}${cStr}${xStr}`);
  });
  return (parts.length > 0 ? parts.join("") : "0") + " = 0";
}

/** Sub/superscript helpers */
const SUB = ["₀","₁","₂","₃","₄","₅"];

const BriotRuffiniView = ({ degree, coeffs, roots }: Props) => {
  const realRoots = roots
    .filter((r) => Math.abs(r.imag) < 1e-8)
    .map((r) => r.real);

  const [rootIdx, setRootIdx] = useState(0);

  if (degree < 2) {
    return (
      <div className="whiteboard p-5 text-center text-muted-foreground text-sm font-serif italic">
        A regra de Briot-Ruffini aplica-se a equações de grau 2 ou superior.
      </div>
    );
  }

  if (realRoots.length === 0) {
    return (
      <div className="whiteboard p-5 text-center">
        <p className="font-serif text-base text-primary mb-2">Sem raízes reais</p>
        <p className="text-sm text-muted-foreground">
          A regra de Briot-Ruffini requer ao menos uma raiz real como divisor.
          As raízes desta equação são complexas conjugadas.
        </p>
      </div>
    );
  }

  const root = realRoots[Math.min(rootIdx, realRoots.length - 1)];
  const n = coeffs.length; // degree + 1

  // Synthetic division
  const top: number[] = [...coeffs];
  const mid: (number | null)[] = [null]; // first cell empty
  const bot: number[] = [top[0]];
  for (let i = 1; i < n; i++) {
    const m = bot[i - 1] * root;
    mid.push(m);
    bot.push(top[i] + m);
  }
  const quotient = bot.slice(0, n - 1);
  const remainder = bot[n - 1];
  const quotDeg = degree - 1;

  const colW = "w-14 sm:w-16";

  return (
    <div className="whiteboard p-4 sm:p-5 space-y-4">
      <div>
        <h3 className="font-serif text-base font-semibold text-primary mb-0.5">
          Regra de Briot-Ruffini
        </h3>
        <p className="text-xs text-muted-foreground">
          Divisão sintética — fatoramos (x − r) do polinômio usando uma raiz conhecida.
        </p>
      </div>

      {/* Root selector (if multiple real roots) */}
      {realRoots.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground self-center">Raiz divisora:</span>
          {realRoots.map((r, i) => (
            <button
              key={i}
              onClick={() => setRootIdx(i)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                rootIdx === i
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              r{SUB[i + 1] ?? (i + 1)} = {fmtN(r)}
            </button>
          ))}
        </div>
      )}

      {/* Synthetic division table */}
      <div className="overflow-x-auto">
        <div className="inline-flex flex-col font-mono text-sm min-w-max gap-0">
          {/* Row 1: root | original coefficients */}
          <div className="flex items-center">
            <div className={`${colW} pr-3 text-right font-semibold text-accent border-r-2 border-foreground/30`}>
              {fmtN(root)}
            </div>
            {top.map((v, i) => (
              <div key={i} className={`${colW} text-center text-foreground`}>
                {fmtN(v)}
              </div>
            ))}
          </div>

          {/* Row 2: blank | multiplications */}
          <div className="flex items-center">
            <div className={`${colW} border-r-2 border-foreground/30`} />
            {mid.map((v, i) =>
              v === null ? (
                <div key={i} className={colW} />
              ) : (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`${colW} text-center text-primary/50 text-xs`}
                >
                  {v >= 0 ? `+${fmtN(v)}` : fmtN(v)}
                </motion.div>
              )
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center my-0.5">
            <div className={`${colW} border-r-2 border-foreground/30`} />
            <div className="flex-1 border-t border-foreground/40 mx-1" style={{ minWidth: `${n * 64}px` }} />
          </div>

          {/* Row 3: blank | quotient + remainder */}
          <div className="flex items-center">
            <div className={`${colW} border-r-2 border-foreground/30`} />
            {bot.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 + i * 0.04 }}
                className={`${colW} text-center font-semibold ${
                  i === bot.length - 1
                    ? Math.abs(v) < 1e-8
                      ? "text-green-600"
                      : "text-destructive"
                    : "text-foreground"
                }`}
              >
                {fmtN(v)}
                {i === bot.length - 1 && (
                  <span className="block text-[10px] font-normal text-muted-foreground">resto</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Remainder verification */}
      {Math.abs(remainder) < 1e-8 ? (
        <p className="text-xs text-green-600 font-medium">
          Resto = 0 ✓ — confirma que {fmtN(root)} é raiz do polinômio.
        </p>
      ) : (
        <p className="text-xs text-destructive">
          Resto ≈ {fmtN(remainder)} — raiz aproximada (erro numérico).
        </p>
      )}

      {/* Quotient polynomial */}
      <div className="rounded-lg border border-accent/30 bg-secondary p-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
          Polinômio quociente (grau {quotDeg})
        </p>
        <div className="overflow-x-auto">
          <MathDisplay latex={quotientLatex(quotient, quotDeg)} />
        </div>
        {quotDeg === 2 && (
          <p className="text-xs text-muted-foreground mt-2">
            Resolva este trinômio com a Fórmula de Bhaskara para encontrar as demais raízes.
          </p>
        )}
        {quotDeg === 1 && (
          <p className="text-xs text-muted-foreground mt-2">
            Equação linear — a única raiz restante é obtida diretamente.
          </p>
        )}
      </div>
    </div>
  );
};

export default BriotRuffiniView;
