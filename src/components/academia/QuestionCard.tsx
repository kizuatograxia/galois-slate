import { memo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X, ScrollText, ArrowRight } from "lucide-react";
import MathDisplay from "@/components/MathDisplay";
import type { Question } from "@/lib/academiaTypes";

interface Props {
  question: Question;
  questionNumber: number;
  total: number;
  onAnswer: (isCorrect: boolean) => void;
}

const LETTERS = ["A", "B", "C", "D"];

const QuestionCard = memo(({ question, questionNumber, total, onAnswer }: Props) => {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const isCorrect = selected === question.correctIndex;
  const progressPct = ((questionNumber - 1) / total) * 100;

  const handlePick = (i: number) => {
    if (answered) return;
    setSelected(i);
  };

  const handleNext = () => {
    onAnswer(isCorrect);
  };

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="font-serif-display text-xs uppercase tracking-widest text-muted-foreground">
          Questão {questionNumber} / {total}
        </span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-accent"
            initial={false}
            animate={{ width: `${progressPct}%` }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
          />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 shadow-[var(--shadow-paper)]">
        <h3 className="font-serif-display text-2xl leading-snug text-foreground">
          {question.prompt}
        </h3>
        {question.promptLatex && (
          <div className="mt-4">
            <MathDisplay latex={question.promptLatex} />
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {question.options.map((opt, i) => {
            const letter = LETTERS[i];
            const isPicked = selected === i;
            const isRight = i === question.correctIndex;

            let stateClasses =
              "border-border bg-card hover:border-accent hover:bg-accent/5";
            let badgeClasses = "bg-muted text-foreground";

            if (answered) {
              if (isPicked && isCorrect) {
                stateClasses = "border-green-600 bg-green-50 text-green-800";
                badgeClasses = "bg-green-600 text-white";
              } else if (isPicked && !isCorrect) {
                stateClasses = "border-red-500 bg-red-50 text-red-800";
                badgeClasses = "bg-red-500 text-white";
              } else if (!isPicked && isRight) {
                stateClasses = "border-green-400 bg-green-50/50 text-green-800";
                badgeClasses = "bg-green-500 text-white";
              } else {
                stateClasses = "border-border bg-card opacity-60";
              }
            }

            return (
              <button
                key={i}
                type="button"
                disabled={answered}
                onClick={() => handlePick(i)}
                aria-label={`opção ${letter}: ${opt}`}
                className={`flex items-center gap-3 rounded-md border px-4 py-3 text-left transition-colors duration-150 ${stateClasses} disabled:cursor-default`}
              >
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs ${badgeClasses}`}>
                  {answered && isPicked && isCorrect && <Check size={14} />}
                  {answered && isPicked && !isCorrect && <X size={14} />}
                  {(!answered || (!isPicked && !(isRight && answered))) && letter}
                  {answered && !isPicked && isRight && <Check size={14} />}
                </span>
                <span className="font-sans text-base">{opt}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {answered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="mt-6 rounded-md border-l-4 border-accent bg-muted/40 p-4">
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <span className="inline-flex items-center gap-1 font-serif-display text-base font-semibold text-green-700">
                      <Check size={16} /> Correto!
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-serif-display text-base font-semibold text-red-700">
                      <X size={16} /> Incorreto
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-foreground">{question.explanation}</p>
                {question.explanationLatex && (
                  <div className="mt-2">
                    <MathDisplay latex={question.explanationLatex} />
                  </div>
                )}
                <div className="mt-4 border-t border-border pt-3">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                    <ScrollText size={14} />
                    Sobre Este Problema
                  </div>
                  <p className="mt-2 font-chalk text-base italic text-muted-foreground">
                    {question.historicalNote}
                  </p>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
                  >
                    Próxima
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

QuestionCard.displayName = "QuestionCard";
export default QuestionCard;
