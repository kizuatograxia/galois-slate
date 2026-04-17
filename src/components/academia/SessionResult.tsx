import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Star, BookOpen, Lightbulb, RotateCw, Home } from "lucide-react";
import type { SessionResult as SessionResultType } from "@/lib/academiaTypes";

interface Props {
  result: SessionResultType;
  onRestart: () => void;
  onHome: () => void;
}

const performance = (correct: number, total: number) => {
  const pct = correct / total;
  if (pct >= 1) return { Icon: Trophy, color: "text-[hsl(45,80%,45%)]", message: "Perfeito! Galois ficaria orgulhoso." };
  if (pct >= 0.8) return { Icon: Star, color: "text-accent", message: "Excelente! Você está dominando o assunto." };
  if (pct >= 0.6) return { Icon: BookOpen, color: "text-foreground", message: "Bom trabalho! Continue praticando." };
  return { Icon: Lightbulb, color: "text-muted-foreground", message: "Cada erro é uma lição. Tente novamente!" };
};

const SessionResult = memo(({ result, onRestart, onHome }: Props) => {
  const { Icon, color, message } = performance(result.correct, result.total);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = performance.length; // unused trick
    void start;
    const duration = 1200;
    const t0 = Date.now();
    const tick = () => {
      const elapsed = Date.now() - t0;
      const p = Math.min(1, elapsed / duration);
      setCount(Math.round(p * result.xpEarned));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [result.xpEarned]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="mx-auto w-full max-w-md rounded-lg border border-border bg-card p-8 text-center shadow-[var(--shadow-book)]"
    >
      <div className="mb-3 flex justify-center">
        <Icon size={56} className={color} strokeWidth={1.6} />
      </div>
      <div className="font-serif-display text-5xl text-foreground">
        {result.correct}/{result.total}
      </div>
      <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">corretas</div>

      <div className="mt-6 font-chalk text-3xl text-accent">+{count} XP</div>

      <p className="mt-4 font-serif-display text-lg italic text-foreground">{message}</p>

      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
        >
          <RotateCw size={16} />
          Jogar Novamente
        </button>
        <button
          type="button"
          onClick={onHome}
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
        >
          <Home size={16} />
          Início
        </button>
      </div>
    </motion.div>
  );
});

SessionResult.displayName = "SessionResult";
export default SessionResult;
