import { memo } from "react";
import { motion } from "framer-motion";
import { Flame, BookOpen } from "lucide-react";
import type { UserProgress } from "@/lib/academiaTypes";

interface Props {
  progress: UserProgress;
}

const levelTitle = (level: number): { label: string; className: string } => {
  if (level >= 13) return { label: "Galois", className: "text-[hsl(270,60%,50%)]" };
  if (level >= 8) return { label: "Mestre", className: "text-[hsl(45,70%,40%)]" };
  if (level >= 4) return { label: "Estudante", className: "text-accent" };
  return { label: "Aprendiz", className: "text-muted-foreground" };
};

const AcademiaHeader = memo(({ progress }: Props) => {
  const xpInLevel = progress.xp % 200;
  const pct = (xpInLevel / 200) * 100;
  const { label, className } = levelTitle(progress.level);
  const onFire = progress.streak >= 3;

  return (
    <header
      aria-label="progresso do usuário"
      className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          {onFire ? (
            <motion.span
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-1 text-[hsl(20,85%,50%)]"
              aria-label={`${progress.streak} dias de streak`}
            >
              <Flame size={18} strokeWidth={2.2} />
              <span className="font-chalk text-xl">{progress.streak}d</span>
            </motion.span>
          ) : (
            <span className="flex items-center gap-1 text-muted-foreground" aria-label={`${progress.streak} dias de streak`}>
              <BookOpen size={18} />
              <span className="font-chalk text-xl">{progress.streak}d</span>
            </span>
          )}
        </div>

        <div className="flex flex-1 items-center gap-3">
          <div className="hidden flex-col items-start sm:flex">
            <span className={`font-serif-display text-[10px] uppercase tracking-widest ${className}`}>
              {label}
            </span>
            <span className="font-serif-display text-xs uppercase tracking-widest text-foreground">
              Nível {progress.level}
            </span>
          </div>
          <div className="flex-1">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                layoutId="xp-bar"
                className="h-full rounded-full bg-accent"
                initial={false}
                animate={{ width: `${pct}%` }}
                transition={{ type: "spring", stiffness: 280, damping: 26 }}
              />
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
              <span className="sm:hidden">Nv {progress.level}</span>
              <span>{xpInLevel} / 200 XP</span>
            </div>
          </div>
        </div>

        <div className="font-serif-display text-sm text-foreground">
          <span className="font-chalk text-2xl text-accent">{progress.xp}</span>
          <span className="ml-1 text-xs uppercase tracking-widest text-muted-foreground">XP</span>
        </div>
      </div>
    </header>
  );
});

AcademiaHeader.displayName = "AcademiaHeader";
export default AcademiaHeader;
