import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MathDisplay from "./MathDisplay";
import { solveLinear, solveQuadratic, solveCubic, type Solution } from "@/lib/GaloisEngine";

interface EquationCalculatorProps {
  degree: number;
  onBack: () => void;
}

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

const EquationCalculator = ({ degree, onBack }: EquationCalculatorProps) => {
  const labels = coeffLabels[degree];
  const [coeffs, setCoeffs] = useState<number[]>(labels.map(() => 0));
  const [solution, setSolution] = useState<Solution | null>(null);

  const updateCoeff = (i: number, val: string) => {
    const next = [...coeffs];
    next[i] = val === "" || val === "-" ? 0 : parseFloat(val) || 0;
    setCoeffs(next);
  };

  const solve = () => {
    let sol: Solution;
    if (degree === 1) sol = solveLinear(coeffs[0], coeffs[1]);
    else if (degree === 2) sol = solveQuadratic(coeffs[0], coeffs[1], coeffs[2]);
    else sol = solveCubic(coeffs[0], coeffs[1], coeffs[2], coeffs[3]);
    setSolution(sol);
  };

  const info = degreeLabels[degree];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="flex min-h-screen flex-col items-center px-4 py-12"
    >
      {/* Header */}
      <button
        onClick={onBack}
        className="group mb-8 flex items-center gap-2 self-start text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <span className="transition-transform group-hover:-translate-x-1">←</span>
        Voltar à estante
      </button>

      <h2 className="mb-2 font-serif text-4xl font-semibold text-primary">{info.title}</h2>
      <MathDisplay latex={info.equation} className="mb-10 text-muted-foreground" />

      {/* Input area */}
      <div className="whiteboard w-full max-w-xl p-8">
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Insira os coeficientes:
        </p>

        <div className="mb-8 flex items-center justify-center gap-6">
          {labels.map((label, i) => (
            <div key={label} className="flex flex-col items-center">
              <label className="mb-2 font-serif text-sm text-muted-foreground">{label}</label>
              <input
                type="number"
                className="input-notebook w-20"
                placeholder="0"
                onChange={(e) => updateCoeff(i, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={solve}
            className="rounded-lg bg-accent px-8 py-3 font-medium text-accent-foreground transition-all duration-200 hover:shadow-lg hover:brightness-110"
          >
            Resolver
          </button>
        </div>
      </div>

      {/* Solution */}
      <AnimatePresence>
        {solution && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="mt-10 w-full max-w-xl"
          >
            <h3 className="mb-6 font-serif text-2xl font-semibold text-primary">
              Passo a Passo — Método de Galois
            </h3>

            <div className="space-y-4">
              {solution.steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="whiteboard p-6"
                >
                  <div className="mb-2 flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                      {i + 1}
                    </span>
                    <span className="font-serif text-lg font-semibold text-primary">
                      {step.title}
                    </span>
                  </div>
                  <div className="my-3 overflow-x-auto">
                    <MathDisplay latex={step.latex} />
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Group info box */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: solution.steps.length * 0.1 + 0.2 }}
              className="mt-6 rounded-lg border border-accent/30 bg-secondary p-6"
            >
              <h4 className="mb-2 font-serif text-lg font-semibold text-primary">
                Estrutura de Grupo (Galois)
              </h4>
              <p className="font-chalk text-lg text-foreground">{solution.groupInfo}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EquationCalculator;
