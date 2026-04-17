import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BookShelf from "@/components/BookShelf";
import ExpandedBook from "@/components/ExpandedBook";
import ExpandedCalculator from "@/components/ExpandedCalculator";
import Navigation, { type SectionKey } from "@/components/Navigation";
import MathBackground from "@/components/MathBackground";
import ConverterShelf from "@/components/converters/ConverterShelf";
import ExpandedConverter from "@/components/converters/ExpandedConverter";
import type { CategoryKey } from "@/components/converters/converterData";
import AcademiaSection from "@/components/academia/AcademiaSection";
import type { CalculatorType } from "@/lib/calcTypes";

export interface BookRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const sectionVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
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

  // Equation book state
  const [selectedDegree, setSelectedDegree] = useState<number | null>(null);
  const [bookRect, setBookRect] = useState<BookRect | null>(null);

  // Converter state
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
  const [converterRect, setConverterRect] = useState<BookRect | null>(null);

  // Calculator state
  const [selectedCalcType, setSelectedCalcType] = useState<CalculatorType | null>(null);
  const [calcRect, setCalcRect] = useState<BookRect | null>(null);

  const handleSelectBook = useCallback((degree: number, rect: DOMRect) => {
    setBookRect({ x: rect.x, y: rect.y, width: rect.width, height: rect.height });
    requestAnimationFrame(() => setSelectedDegree(degree));
  }, []);

  const handleBackBook = useCallback(() => {
    setSelectedDegree(null);
    setBookRect(null);
  }, []);

  const handleSelectConverter = useCallback((key: CategoryKey, rect: BookRect) => {
    setConverterRect(rect);
    requestAnimationFrame(() => setSelectedCategory(key));
  }, []);

  const handleBackConverter = useCallback(() => {
    setSelectedCategory(null);
    setConverterRect(null);
  }, []);

  const handleSelectCalc = useCallback((type: CalculatorType, rect: DOMRect) => {
    setCalcRect({ x: rect.x, y: rect.y, width: rect.width, height: rect.height });
    requestAnimationFrame(() => setSelectedCalcType(type));
  }, []);

  const handleBackCalc = useCallback(() => {
    setSelectedCalcType(null);
    setCalcRect(null);
  }, []);

  const handleSectionChange = useCallback((next: SectionKey) => {
    setSelectedDegree(null);
    setBookRect(null);
    setSelectedCategory(null);
    setConverterRect(null);
    setSelectedCalcType(null);
    setCalcRect(null);
    setSection(next);
  }, []);

  const showNavigation =
    selectedDegree === null && selectedCategory === null && selectedCalcType === null;

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
              {selectedDegree === null && selectedCalcType === null ? (
                <BookShelf
                  key="shelf"
                  onSelect={handleSelectBook}
                  onSelectCalc={handleSelectCalc}
                />
              ) : null}
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
            <AnimatePresence mode="wait">
              {selectedCategory === null ? (
                <ConverterShelf key="conv-shelf" onSelect={handleSelectConverter} />
              ) : null}
            </AnimatePresence>
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
            <AcademiaSection />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen overlays — rendered above everything */}
      <AnimatePresence>
        {selectedDegree !== null && bookRect && (
          <ExpandedBook
            key={`expanded-book-${selectedDegree}`}
            degree={selectedDegree}
            initialRect={bookRect}
            onBack={handleBackBook}
          />
        )}
        {selectedCategory !== null && converterRect && (
          <ExpandedConverter
            key={`expanded-conv-${selectedCategory}`}
            category={selectedCategory}
            initialRect={converterRect}
            onBack={handleBackConverter}
          />
        )}
        {selectedCalcType !== null && calcRect && (
          <ExpandedCalculator
            key={`expanded-calc-${selectedCalcType}`}
            calcType={selectedCalcType}
            initialRect={calcRect}
            onBack={handleBackCalc}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
