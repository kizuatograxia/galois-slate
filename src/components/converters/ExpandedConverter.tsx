import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import MathBackground from "@/components/MathBackground";
import UnitConverter from "./UnitConverter";
import TemperatureConverter from "./TemperatureConverter";
import CurrencyConverter from "./CurrencyConverter";
import CryptoConverter from "./CryptoConverter";
import { notebooks, linearCategories, type CategoryKey, type LinearCategoryKey } from "./converterData";
import type { BookRect } from "@/pages/Index";

interface ExpandedConverterProps {
  category: CategoryKey;
  initialRect: BookRect;
  onBack: () => void;
}

const ExpandedConverter = ({ category, initialRect, onBack }: ExpandedConverterProps) => {
  const [showContent, setShowContent] = useState(false);
  const meta = notebooks.find((n) => n.key === category)!;

  const viewport = useMemo(
    () => ({
      width: typeof window === "undefined" ? initialRect.width : window.innerWidth,
      height: typeof window === "undefined" ? initialRect.height : window.innerHeight,
    }),
    [initialRect.height, initialRect.width],
  );
  const initialScale = useMemo(
    () => ({
      x: initialRect.width / viewport.width,
      y: initialRect.height / viewport.height,
    }),
    [initialRect.height, initialRect.width, viewport.height, viewport.width],
  );

  const renderBody = () => {
    if (category === "temperature") return <TemperatureConverter />;
    if (category === "currency") return <CurrencyConverter />;
    if (category === "crypto") return <CryptoConverter />;
    const linear = linearCategories[category as LinearCategoryKey];
    return <UnitConverter category={linear} />;
  };

  return (
    <motion.div
      initial={{
        x: initialRect.x,
        y: initialRect.y,
        scaleX: initialScale.x,
        scaleY: initialScale.y,
        borderRadius: 8,
      }}
      animate={{ x: 0, y: 0, scaleX: 1, scaleY: 1, borderRadius: 0 }}
      exit={{
        x: initialRect.x,
        y: initialRect.y,
        scaleX: initialScale.x,
        scaleY: initialScale.y,
        borderRadius: 8,
        opacity: 0,
      }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => setShowContent(true)}
      className={`fixed inset-0 z-50 bg-gradient-to-b ${meta.color} overflow-hidden`}
      style={{ transformOrigin: "0 0", willChange: "transform, border-radius", backfaceVisibility: "hidden" }}
    >
      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.24 }}
          className="relative h-full overflow-y-auto"
        >
          <MathBackground theme="dark" />

          <div className="relative z-10 flex items-center justify-between px-4 py-4 sm:px-6">
            <button
              onClick={onBack}
              className="group flex items-center gap-2 text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
            >
              <span className="transition-transform group-hover:-translate-x-1">←</span>
              Voltar
            </button>
            <span className="font-serif-display text-sm tracking-[0.2em] uppercase text-primary-foreground/40">
              Conversor
            </span>
          </div>

          <div className="relative z-10 flex flex-col items-center px-4 pb-12 sm:px-6">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
              className="mb-1 text-center font-serif-display text-3xl font-semibold text-primary-foreground sm:text-4xl"
            >
              {meta.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.28 }}
              className="mb-6 text-center text-sm text-primary-foreground/65 sm:mb-8"
            >
              {meta.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
              className="w-full flex justify-center"
            >
              {renderBody()}
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ExpandedConverter;
