import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BookShelf from "@/components/BookShelf";
import ExpandedBook from "@/components/ExpandedBook";

export interface BookRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const Index = () => {
  const [selectedDegree, setSelectedDegree] = useState<number | null>(null);
  const [bookRect, setBookRect] = useState<BookRect | null>(null);

  const handleSelect = useCallback((degree: number, rect: DOMRect) => {
    setBookRect({ x: rect.x, y: rect.y, width: rect.width, height: rect.height });
    // Small delay to let the expand animation start
    requestAnimationFrame(() => {
      setSelectedDegree(degree);
    });
  }, []);

  const handleBack = useCallback(() => {
    setSelectedDegree(null);
    setBookRect(null);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <AnimatePresence mode="wait">
        {selectedDegree === null ? (
          <BookShelf key="shelf" onSelect={handleSelect} />
        ) : null}
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
