import { memo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calculator, FunctionSquare, Triangle, Activity, Dices, X } from "lucide-react";
import type { Difficulty, TopicKey, UserProgress } from "@/lib/academiaTypes";
import { DIFFICULTY_LABELS, TOPIC_LABELS, XP_BY_DIFFICULTY } from "@/lib/academiaTypes";

interface Props {
  onSelect: (topic: TopicKey, difficulty: Difficulty) => void;
  progress: UserProgress;
}

const TOPIC_META: { key: TopicKey; Icon: typeof Calculator; subtitle: string }[] = [
  { key: "aritmetica", Icon: Calculator, subtitle: "Fundamentos numéricos" },
  { key: "algebra", Icon: FunctionSquare, subtitle: "Equações & funções" },
  { key: "geometria", Icon: Triangle, subtitle: "Formas & medidas" },
  { key: "trigonometria", Icon: Activity, subtitle: "Senos & cossenos" },
  { key: "probabilidade", Icon: Dices, subtitle: "Acaso & combinatória" },
];

const DIFFICULTIES: Difficulty[] = ["iniciante", "intermediario", "avancado"];

const TopicSelector = memo(({ onSelect, progress }: Props) => {
  const [openTopic, setOpenTopic] = useState<TopicKey | null>(null);
  const [picked, setPicked] = useState<Difficulty>("iniciante");

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8">
      <div className="mb-8 text-center">
        <h2 className="font-serif-display text-3xl text-foreground sm:text-4xl">Academia</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Escolha um tópico e treine com questões geradas a cada sessão.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOPIC_META.map(({ key, Icon, subtitle }) => {
          const mastery = progress.topicMastery[key];
          return (
            <motion.button
              key={key}
              type="button"
              onClick={() => {
                setOpenTopic(key);
                setPicked("iniciante");
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="group flex flex-col items-start gap-3 rounded-lg border border-border bg-card p-5 text-left transition-shadow hover:shadow-[var(--shadow-hover)]"
            >
              <div className="flex w-full items-center justify-between">
                <Icon size={22} className="text-accent" />
                <span className="font-chalk text-base text-muted-foreground">{mastery}%</span>
              </div>
              <div>
                <h3 className="font-serif-display text-xl text-foreground">{TOPIC_LABELS[key]}</h3>
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
                <motion.div
                  layout
                  className="h-full rounded-full bg-accent"
                  initial={false}
                  animate={{ width: `${mastery}%` }}
                  transition={{ type: "spring", stiffness: 280, damping: 26 }}
                />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {mastery}% dominado
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {openTopic && (
          <motion.div
            className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenTopic(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-[var(--shadow-book)]"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-serif-display text-2xl text-foreground">
                    {TOPIC_LABELS[openTopic]}
                  </h3>
                  <p className="text-xs text-muted-foreground">Selecione a dificuldade</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenTopic(null)}
                  className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Fechar"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setPicked(d)}
                    className={`rounded-md border px-3 py-3 text-center transition-colors ${
                      picked === d
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border bg-background text-foreground hover:border-accent/60"
                    }`}
                  >
                    <div className="font-serif-display text-sm">{DIFFICULTY_LABELS[d]}</div>
                    <div className="font-chalk text-base text-muted-foreground">+{XP_BY_DIFFICULTY[d]} XP</div>
                  </button>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpenTopic(null)}
                  className="rounded-md border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const t = openTopic;
                    const d = picked;
                    setOpenTopic(null);
                    onSelect(t, d);
                  }}
                  className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
                >
                  Iniciar Sessão
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

TopicSelector.displayName = "TopicSelector";
export default TopicSelector;
