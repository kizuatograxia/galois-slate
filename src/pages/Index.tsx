import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import BookShelf from "@/components/BookShelf";
import EquationCalculator from "@/components/EquationCalculator";

const Index = () => {
  const [selectedDegree, setSelectedDegree] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {selectedDegree === null ? (
          <BookShelf key="shelf" onSelect={setSelectedDegree} />
        ) : (
          <EquationCalculator
            key={`calc-${selectedDegree}`}
            degree={selectedDegree}
            onBack={() => setSelectedDegree(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
