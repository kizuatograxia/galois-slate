import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import MathBackground from "@/components/MathBackground";
import NormalCalcView from "@/components/calculators/NormalCalcView";
import EngineeringCalcView from "@/components/calculators/EngineeringCalcView";
import FinancialCalcView from "@/components/calculators/FinancialCalcView";
import { CALC_BOOKS, type CalculatorType } from "@/lib/calcTypes";
import type { BookRect } from "@/pages/Index";

interface ExpandedCalculatorProps {
  calcType: CalculatorType;
  initialRect: BookRect;
  onBack: () => void;
}

const ExpandedCalculator = ({ calcType, initialRect, onBack }: ExpandedCalculatorProps) => {
  const book = CALC_BOOKS.find(b => b.type === calcType)!;

  const viewport = useMemo(() => ({
    width:  typeof window === "undefined" ? initialRect.width  : window.innerWidth,
    height: typeof window === "undefined" ? initialRect.height : window.innerHeight,
  }), [initialRect.height, initialRect.width]);

  const initialScale = useMemo(() => ({
    x: initialRect.width  / viewport.width,
    y: initialRect.height / viewport.height,
  }), [initialRect.height, initialRect.width, viewport.height, viewport.width]);

  const renderBody = () => {
    if (calcType === "normal")      return <NormalCalcView />;
    if (calcType === "engineering") return <EngineeringCalcView />;
    return <FinancialCalcView />;
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
      className={`fixed inset-0 z-50 bg-gradient-to-b ${book.expandedColor} overflow-hidden`}
      style={{ transformOrigin: "0 0", willChange: "transform, border-radius", backfaceVisibility: "hidden" }}
    >
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28, duration: 0.18 }}
          className="relative h-full overflow-y-auto"
        >
          <MathBackground opacity={0.04} color="hsl(0, 0%, 90%)" />

          {/* Top bar */}
          <div className="relative z-10 flex items-center justify-between px-4 py-4 sm:px-6">
            <button
              onClick={onBack}
              className="group flex items-center gap-2 text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
            >
              <span className="transition-transform group-hover:-translate-x-1">←</span>
              Voltar
            </button>
            <span className="font-serif text-sm tracking-[0.2em] text-primary-foreground/40 uppercase">
              {book.subtitle}
            </span>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center px-3 pb-10 sm:px-4">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
              className="mb-6 font-serif text-2xl font-semibold text-primary-foreground sm:text-3xl"
            >
              {book.subtitle}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
              className="w-full"
            >
              {renderBody()}
            </motion.div>
          </div>
        </motion.div>
    </motion.div>
  );
};

export default ExpandedCalculator;
