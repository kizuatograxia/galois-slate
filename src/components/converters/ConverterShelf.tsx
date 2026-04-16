import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Ruler, Scale, Zap, Droplets, Thermometer, Gauge, Coins, Bitcoin } from "lucide-react";
import MathBackground from "@/components/MathBackground";
import { notebooks, type CategoryKey, type NotebookMeta } from "./converterData";
import type { BookRect } from "@/pages/Index";

const ICON_MAP = { Ruler, Scale, Zap, Droplets, Thermometer, Gauge, Coins, Bitcoin } as const;

interface ConverterShelfProps {
  onSelect: (key: CategoryKey, rect: BookRect) => void;
}

const ConverterShelf = ({ onSelect }: ConverterShelfProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleClick = (notebook: NotebookMeta, i: number) => {
    const el = refs.current[i];
    if (!el) return;
    const r = el.getBoundingClientRect();
    onSelect(notebook.key, { x: r.x, y: r.y, width: r.width, height: r.height });
  };

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-24 pb-12 overflow-hidden"
    >
      <MathBackground theme="light" />

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-2 px-4 text-center font-serif-display text-4xl font-semibold tracking-tight text-primary sm:text-5xl md:text-6xl"
      >
        Conversores
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-10 px-4 text-center text-base text-muted-foreground sm:text-lg"
      >
        Escolha um caderno para começar
      </motion.p>

      <div className="grid w-full max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 md:gap-6">
        {notebooks.map((nb, i) => {
          const Icon = ICON_MAP[nb.icon];
          const isHovered = hovered === i;
          const isOther = hovered !== null && hovered !== i;

          return (
            <motion.button
              key={nb.key}
              ref={(el) => { refs.current[i] = el; }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.45 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleClick(nb, i)}
              className="group relative cursor-pointer focus:outline-none"
            >
              <motion.div
                animate={{
                  opacity: isOther ? 0.65 : 1,
                  scale: isHovered ? 1.04 : isOther ? 0.98 : 1,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                className={`relative flex h-44 flex-col items-start justify-between overflow-hidden rounded-lg bg-gradient-to-b ${nb.color} p-4 sm:h-48 sm:p-5`}
                style={{
                  boxShadow: isHovered
                    ? "0 12px 40px -10px hsla(215, 40%, 20%, 0.35)"
                    : "0 6px 24px -8px hsla(215, 40%, 20%, 0.22)",
                }}
              >
                <div className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-transparent via-primary-foreground/25 to-transparent" />

                <Icon className="text-primary-foreground/85" size={28} aria-hidden="true" />

                <div className="flex flex-col items-start text-left">
                  <span className="font-serif-display text-xl font-semibold leading-tight text-primary-foreground">
                    {nb.title}
                  </span>
                  <span className="mt-1 text-xs text-primary-foreground/65">{nb.subtitle}</span>
                </div>
              </motion.div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ConverterShelf;
