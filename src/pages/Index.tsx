import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BookShelf from "@/components/BookShelf";
import ExpandedBook from "@/components/ExpandedBook";
import Navigation, { type SectionKey } from "@/components/Navigation";
import MathBackground from "@/components/MathBackground";

export interface BookRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const sectionVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const ComingSoon = ({ title, description }: { title: string; description: string }) => (
  <div className="relative min-h-screen flex items-center justify-center px-6">
    <MathBackground theme="light" />
    <div className="relative z-10 text-center max-w-xl">
      <h1 className="font-serif-display text-5xl sm:text-6xl text-foreground mb-4">{title}</h1>
      <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">{description}</p>
      <p className="mt-8 font-chalk text-2xl text-accent">em breve</p>
    </div>
  </div>
);

const Index = () => {
  const [section, setSection] = useState<SectionKey>("calculators");
  const [selectedDegree, setSelectedDegree] = useState<number | null>(null);
  const [bookRect, setBookRect] = useState<BookRect | null>(null);

  const handleSelect = useCallback((degree: number, rect: DOMRect) => {
    setBookRect({ x: rect.x, y: rect.y, width: rect.width, height: rect.height });
    requestAnimationFrame(() => {
      setSelectedDegree(degree);
    });
  }, []);

  const handleBack = useCallback(() => {
    setSelectedDegree(null);
    setBookRect(null);
  }, []);

  const handleSectionChange = useCallback((next: SectionKey) => {
    setSelectedDegree(null);
    setBookRect(null);
    setSection(next);
  }, []);

  // Hide top nav while a book is fully expanded for an immersive view.
  const showNavigation = selectedDegree === null;

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {showNavigation && <Navigation active={section} onChange={handleSectionChange} />}

      <AnimatePresence mode="wait">
        {section === "calculators" && (
          <motion.div
            key="section-calculators"
            variants={sectionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <AnimatePresence mode="wait">
              {selectedDegree === null ? <BookShelf key="shelf" onSelect={handleSelect} /> : null}
            </AnimatePresence>
          </motion.div>
        )}

        {section === "converters" && (
          <motion.div
            key="section-converters"
            variants={sectionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <ComingSoon
              title="Conversores"
              description="Cadernos de conversão para comprimento, massa, energia, volume, temperatura, velocidade, moedas e cripto — tudo com fórmulas em LaTeX e dados em tempo real."
            />
          </motion.div>
        )}

        {section === "academia" && (
          <motion.div
            key="section-academia"
            variants={sectionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <ComingSoon
              title="Academia"
              description="Pratique matemática como no Duolingo: streaks, XP, níveis e questões geradas proceduralmente, com notas históricas sobre cada conceito."
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedDegree !== null && bookRect && (
          <ExpandedBook
            key={`expanded-${selectedDegree}`}
            degree={selectedDegree}
            initialRect={bookRect}
            onBack={handleBack}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
