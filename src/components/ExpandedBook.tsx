import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MathDisplay from "./MathDisplay";
import MathBackground from "./MathBackground";
import NumericKeypad from "./NumericKeypad";
import BriotRuffiniView from "./BriotRuffiniView";
import { solveLinear, solveQuadratic, solveCubic, type Solution } from "@/lib/GaloisEngine";
import type { BookRect } from "@/pages/Index";

interface ExpandedBookProps {
  degree: number;
  initialRect: BookRect;
  onBack: () => void;
}

const bookColors: Record<number, string> = {
  1: "from-[hsl(213,70%,30%)] to-[hsl(213,60%,40%)]",
  2: "from-[hsl(215,80%,10%)] to-[hsl(215,60%,22%)]",
  3: "from-[hsl(210,50%,20%)] to-[hsl(213,70%,30%)]",
};

const degreeLabels: Record<number, { title: string; equation: string }> = {
  1: { title: "Equação Linear", equation: "ax + b = 0" },
  2: { title: "Equação Quadrática", equation: "ax^2 + bx + c = 0" },
  3: { title: "Equação Cúbica", equation: "ax^3 + bx^2 + cx + d = 0" },
};

const coeffLabels: Record<number, string[]> = {
  1: ["a", "b"],
  2: ["a", "b", "c"],
  3: ["a", "b", "c", "d"],
};

type SolutionTab = "steps" | "ruffini";

const slideVariants = {
  enter: (dir: number) => ({ x: dir * 48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir * -48, opacity: 0 }),
};

const ExpandedBook = ({ degree, initialRect, onBack }: ExpandedBookProps) => {
  const labels = coeffLabels[degree];
  const [values, setValues] = useState<string[]>(labels.map(() => ""));
  const [activeField, setActiveField] = useState(0);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [showContent, setShowContent] = useState(false);
  const [activeTab, setActiveTab] = useState<SolutionTab>("steps");
  const [slideDir, setSlideDir] = useState(1);
  const info = degreeLabels[degree];

  // Refs for smooth scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);

  const viewport = useMemo(
    () => ({
      width:  typeof window === "undefined" ? initialRect.width  : window.innerWidth,
      height: typeof window === "undefined" ? initialRect.height : window.innerHeight,
    }),
    [initialRect.height, initialRect.width],
  );
  const initialScale = useMemo(
    () => ({
      x: initialRect.width  / viewport.width,
      y: initialRect.height / viewport.height,
    }),
    [initialRect.height, initialRect.width, viewport.height, viewport.width],
  );

  const coeffs = useMemo(
    () => values.map((v) => (v === "" || v === "-" || v === "+" ? 0 : parseFloat(v) || 0)),
    [values],
  );

  // Smooth scroll to solution after it appears
  useEffect(() => {
    if (!solution || !solutionRef.current || !scrollContainerRef.current) return;
    const timer = setTimeout(() => {
      solutionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
    return () => clearTimeout(timer);
  }, [solution]);

  const switchTab = useCallback((tab: SolutionTab) => {
    setSlideDir(tab === "ruffini" ? 1 : -1);
    setActiveTab(tab);
  }, []);

  const handleKey = useCallback((key: string) => {
    setValues((prev) => {
      const next = [...prev];
      const current = next[activeField];
      if (key === "±") {
        if (current.startsWith("-")) next[activeField] = current.slice(1);
        else if (current.startsWith("+")) next[activeField] = `-${current.slice(1)}`;
        else next[activeField] = `-${current}`;
      } else if (key === "+" || key === "-") {
        const unsigned = current.replace(/^[+-]/, "");
        next[activeField] = current.startsWith(key) ? unsigned : `${key}${unsigned}`;
      } else if (key === ".") {
        if (current.includes(".")) return prev;
        next[activeField] = current === "" ? "0." : current === "+" || current === "-" ? `${current}0.` : current + key;
      } else {
        next[activeField] = current + key;
      }
      return next;
    });
  }, [activeField]);

  const handleDelete = useCallback(() => {
    setValues((prev) => {
      const next = [...prev];
      next[activeField] = next[activeField].slice(0, -1);
      return next;
    });
  }, [activeField]);

  const handleClear = useCallback(() => {
    setValues((prev) => {
      const next = [...prev];
      next[activeField] = "";
      return next;
    });
  }, [activeField]);

  const solve = useCallback(() => {
    let sol: Solution;
    if (degree === 1)      sol = solveLinear(coeffs[0], coeffs[1]);
    else if (degree === 2) sol = solveQuadratic(coeffs[0], coeffs[1], coeffs[2]);
    else                   sol = solveCubic(coeffs[0], coeffs[1], coeffs[2], coeffs[3]);
    setSolution(sol);
    setActiveTab("steps"); // reset to steps tab on new solve
  }, [coeffs, degree]);

  useEffect(() => {
    const handleKeyboardInput = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditable =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable;
      if (isEditable || event.ctrlKey || event.metaKey || event.altKey) return;

      if (/^\d$/.test(event.key)) { event.preventDefault(); handleKey(event.key); return; }
      if (event.key === "." || event.key === ",") { event.preventDefault(); handleKey("."); return; }
      if (event.key === "+" || event.key === "-") { event.preventDefault(); handleKey(event.key); return; }
      if (event.key === "Backspace") { event.preventDefault(); handleDelete(); return; }
      if (event.key === "Delete" || event.key === "Escape") { event.preventDefault(); handleClear(); return; }
      if (event.key === "Enter") { event.preventDefault(); solve(); return; }
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        setActiveField((cur) => {
          const dir = event.key === "ArrowRight" ? 1 : -1;
          return (cur + dir + labels.length) % labels.length;
        });
      }
    };
    window.addEventListener("keydown", handleKeyboardInput);
    return () => window.removeEventListener("keydown", handleKeyboardInput);
  }, [handleClear, handleDelete, handleKey, labels.length, solve]);

  const showTabs = solution !== null && degree >= 2;

  return (
    <motion.div
      initial={{ x: initialRect.x, y: initialRect.y, scaleX: initialScale.x, scaleY: initialScale.y, borderRadius: 8 }}
      animate={{ x: 0, y: 0, scaleX: 1, scaleY: 1, borderRadius: 0 }}
      exit={{   x: initialRect.x, y: initialRect.y, scaleX: initialScale.x, scaleY: initialScale.y, borderRadius: 8, opacity: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => setShowContent(true)}
      className={`fixed inset-0 z-50 bg-gradient-to-b ${bookColors[degree]} overflow-hidden`}
      style={{ transformOrigin: "0 0", willChange: "transform, border-radius", backfaceVisibility: "hidden" }}
    >
      {showContent && (
        <motion.div
          ref={scrollContainerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.24 }}
          className="relative h-full overflow-y-auto"
        >
          <MathBackground opacity={0.05} color="hsl(0, 0%, 90%)" />

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
              Vol. {degree}
            </span>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center px-3 pb-10 sm:px-4 sm:pb-12">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
              className="mb-1 px-2 text-center font-serif text-2xl font-semibold text-primary-foreground sm:text-3xl md:text-4xl"
            >
              {info.title}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.28 }}
              className="w-full max-w-full overflow-x-auto text-center"
            >
              <MathDisplay latex={info.equation} className="mb-6 block text-primary-foreground/70 sm:mb-8" />
            </motion.div>

            {/* Whiteboard card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
              className="whiteboard w-full max-w-md p-4 sm:p-6 md:p-8"
            >
              <p className="mb-5 text-center text-sm text-muted-foreground">
                Toque no coeficiente e use o teclado da tela ou do PC:
              </p>

              {/* Coefficient fields */}
              <div className="mb-6 grid grid-cols-2 justify-items-center gap-x-6 gap-y-4 sm:flex sm:items-center sm:justify-center sm:gap-4 md:gap-6">
                {labels.map((label, i) => (
                  <div key={label} className="flex flex-col items-center">
                    <label className="mb-2 font-serif text-sm text-muted-foreground">{label}</label>
                    <button
                      onClick={() => setActiveField(i)}
                      className={`input-notebook w-14 cursor-pointer text-center transition-all duration-200 sm:w-16 md:w-20 ${
                        activeField === i ? "border-b-2 border-accent ring-2 ring-accent/20" : "border-b-2"
                      }`}
                      style={{ borderColor: activeField === i ? undefined : "hsl(var(--border))" }}
                    >
                      <span className="font-chalk text-2xl text-foreground">
                        {values[i] || <span className="text-muted-foreground/50">0</span>}
                      </span>
                    </button>
                  </div>
                ))}
              </div>

              <NumericKeypad onKey={handleKey} onDelete={handleDelete} onClear={handleClear} onSolve={solve} />
            </motion.div>

            {/* ── Solution area with tabs ── */}
            <AnimatePresence>
              {solution && (
                <motion.div
                  ref={solutionRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4 }}
                  className="mt-8 w-full max-w-md"
                  style={{ scrollMarginTop: "72px" }}
                >
                  {/* Tab bar (only shown for degree >= 2) */}
                  {showTabs && (
                    <div className="flex rounded-lg overflow-hidden border border-primary-foreground/20 mb-5">
                      {(
                        [
                          { key: "steps",   label: "Passo a Passo" },
                          { key: "ruffini", label: "Briot-Ruffini" },
                        ] as { key: SolutionTab; label: string }[]
                      ).map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => switchTab(tab.key)}
                          className={`flex-1 py-2 text-sm font-medium transition-all ${
                            activeTab === tab.key
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "text-primary-foreground/50 hover:text-primary-foreground/70"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Sliding tab panels */}
                  <div className="overflow-hidden">
                    <AnimatePresence mode="wait" custom={slideDir} initial={false}>
                      {activeTab === "steps" ? (
                        <motion.div
                          key="steps"
                          custom={slideDir}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.28, ease: "easeInOut" }}
                        >
                          {/* Steps */}
                          {!showTabs && (
                            <h3 className="mb-5 font-serif text-xl font-semibold text-primary-foreground md:text-2xl">
                              Passo a Passo
                            </h3>
                          )}
                          <div className="space-y-3">
                            {solution.steps.map((step, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="whiteboard p-5"
                              >
                                <div className="mb-2 flex items-center gap-3">
                                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                                    {i + 1}
                                  </span>
                                  <span className="font-serif text-base font-semibold text-primary">
                                    {step.title}
                                  </span>
                                </div>
                                <div className="my-2 overflow-x-auto">
                                  <MathDisplay latex={step.latex} />
                                </div>
                                <p className="text-sm text-muted-foreground">{step.description}</p>
                              </motion.div>
                            ))}
                          </div>

                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: solution.steps.length * 0.08 + 0.2 }}
                            className="mt-5 rounded-lg border border-accent/30 bg-secondary p-4 sm:p-5"
                          >
                            <h4 className="mb-1 font-serif text-base font-semibold text-primary">
                              Estrutura de Grupo (Galois)
                            </h4>
                            <p className="font-chalk text-lg text-foreground">{solution.groupInfo}</p>
                          </motion.div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="ruffini"
                          custom={slideDir}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.28, ease: "easeInOut" }}
                        >
                          <BriotRuffiniView
                            degree={degree}
                            coeffs={coeffs}
                            roots={solution.roots}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ExpandedBook;
