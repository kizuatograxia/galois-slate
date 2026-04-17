import { memo, useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MathBackground from "@/components/MathBackground";
import AcademiaHeader from "./AcademiaHeader";
import TopicSelector from "./TopicSelector";
import QuestionCard from "./QuestionCard";
import SessionResult from "./SessionResult";
import { useUserProgress } from "@/hooks/useUserProgress";
import { generateQuestions } from "@/lib/questionGenerators";
import type { Difficulty, Question, TopicKey } from "@/lib/academiaTypes";

type AcademiaView = "home" | "session" | "result";

const SESSION_SIZE = 10;

const AcademiaSection = memo(() => {
  const { progress, addXP, markTopicPlayed } = useUserProgress();
  const [view, setView] = useState<AcademiaView>("home");
  const [topic, setTopic] = useState<TopicKey | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);

  const startSession = useCallback((t: TopicKey, d: Difficulty) => {
    const qs = generateQuestions(t, d, SESSION_SIZE);
    setTopic(t);
    setDifficulty(d);
    setQuestions(qs);
    setCurrentIndex(0);
    setCorrectCount(0);
    setSessionXP(0);
    setView("session");
  }, []);

  const handleAnswer = useCallback(
    (isCorrect: boolean) => {
      const q = questions[currentIndex];
      const newCorrect = correctCount + (isCorrect ? 1 : 0);
      const newXP = sessionXP + (isCorrect ? q.xpReward : 0);
      const nextIndex = currentIndex + 1;
      setCorrectCount(newCorrect);
      setSessionXP(newXP);
      if (nextIndex >= SESSION_SIZE) {
        if (topic) {
          addXP(newXP);
          markTopicPlayed(topic, (newCorrect / SESSION_SIZE) * 100);
        }
        setView("result");
      } else {
        setCurrentIndex(nextIndex);
      }
    },
    [questions, currentIndex, correctCount, sessionXP, topic, addXP, markTopicPlayed],
  );

  const handleRestart = useCallback(() => {
    if (topic && difficulty) startSession(topic, difficulty);
  }, [topic, difficulty, startSession]);

  const handleHome = useCallback(() => {
    setView("home");
    setTopic(null);
    setDifficulty(null);
    setQuestions([]);
    setCurrentIndex(0);
    setCorrectCount(0);
    setSessionXP(0);
  }, []);

  const variants = {
    initial: (v: AcademiaView) => ({ opacity: 0, x: v === "session" ? 40 : -40 }),
    animate: { opacity: 1, x: 0 },
    exit: (v: AcademiaView) => ({ opacity: 0, x: v === "result" ? 40 : -40 }),
  };

  return (
    // pt-[60px] pushes content below the absolute Navigation bar (≈60px tall)
    <div className="relative min-h-screen bg-background pt-[60px]">
      <MathBackground theme="light" opacity={0.04} />
      <AcademiaHeader progress={progress} />

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-8">
        <AnimatePresence mode="wait" custom={view}>
          {view === "home" && (
            <motion.div
              key="home"
              custom={view}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <TopicSelector onSelect={startSession} progress={progress} />
            </motion.div>
          )}

          {view === "session" && questions[currentIndex] && (
            <motion.div
              key="session"
              custom={view}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <QuestionCard
                question={questions[currentIndex]}
                questionNumber={currentIndex + 1}
                total={SESSION_SIZE}
                onAnswer={handleAnswer}
              />
            </motion.div>
          )}

          {view === "result" && topic && difficulty && (
            <motion.div
              key="result"
              custom={view}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <SessionResult
                result={{
                  correct: correctCount,
                  total: SESSION_SIZE,
                  xpEarned: sessionXP,
                  topic,
                  difficulty,
                }}
                onRestart={handleRestart}
                onHome={handleHome}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

AcademiaSection.displayName = "AcademiaSection";
export default AcademiaSection;
