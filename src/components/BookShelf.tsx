import { useState, useRef } from "react";
import { motion } from "framer-motion";
import MathBackground from "./MathBackground";
import { CALC_BOOKS, type CalculatorType } from "@/lib/calcTypes";

interface Book {
  degree: number;
  title: string;
  subtitle: string;
  equation: string;
  color: string;
}

const books: Book[] = [
  {
    degree: 1,
    title: "I",
    subtitle: "Equação Linear",
    equation: "ax + b = 0",
    color: "from-[hsl(213,70%,30%)] to-[hsl(213,60%,40%)]",
  },
  {
    degree: 2,
    title: "II",
    subtitle: "Equação Quadrática",
    equation: "ax² + bx + c = 0",
    color: "from-[hsl(215,80%,10%)] to-[hsl(215,60%,22%)]",
  },
  {
    degree: 3,
    title: "III",
    subtitle: "Equação Cúbica",
    equation: "ax³ + bx² + cx + d = 0",
    color: "from-[hsl(210,50%,20%)] to-[hsl(213,70%,30%)]",
  },
];

interface BookShelfProps {
  onSelect: (degree: number, rect: DOMRect) => void;
  onSelectCalc: (type: CalculatorType, rect: DOMRect) => void;
}

/* ── Shared book-spine component ─────────────────────────────────── */
interface SpineProps {
  title: string;
  subtitle: string;
  label: string;
  color: string;
  hoverSymbol: string;
  index: number;
  isHovered: boolean;
  isOther: boolean;
  btnRef: (el: HTMLButtonElement | null) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

const BookSpine = ({
  title, subtitle, label, color, hoverSymbol,
  index, isHovered, isOther,
  btnRef, onMouseEnter, onMouseLeave, onClick,
}: SpineProps) => (
  <motion.button
    ref={btnRef}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.05 + index * 0.06, duration: 0.35 }}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onClick={onClick}
    className="group relative cursor-pointer focus:outline-none"
    style={{ transformOrigin: "bottom center" }}
  >
    <motion.div
      animate={{
        opacity: isOther ? 0.6 : 1,
        scale: isHovered ? 1.04 : isOther ? 0.98 : 1,
      }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`relative flex h-[min(44vh,300px)] w-[clamp(4.5rem,22vw,7.5rem)] flex-col items-center justify-between overflow-hidden rounded-lg bg-gradient-to-b ${color} p-3 sm:p-4 md:h-[340px] md:p-5`}
      style={{
        boxShadow: isHovered
          ? "0 12px 50px -10px hsla(213, 70%, 30%, 0.35), 4px 0 15px -5px hsla(213, 70%, 30%, 0.1)"
          : "0 8px 40px -8px hsla(215, 40%, 20%, 0.2)",
      }}
    >
      <div className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-transparent via-primary-foreground/20 to-transparent" />

      <div className="mt-4 flex flex-col items-center">
        <span className="font-serif text-2xl font-bold tracking-wider text-primary-foreground/90 sm:text-3xl md:text-4xl">
          {title}
        </span>
      </div>

      <motion.div
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
        transition={{ duration: 0.3 }}
        className="hidden flex-col items-center text-center md:flex"
      >
        <span className="text-sm font-medium tracking-wide text-primary-foreground/80">
          {subtitle}
        </span>
        <span className="mt-2 font-chalk text-2xl text-primary-foreground/70">
          {hoverSymbol}
        </span>
      </motion.div>

      <div className="mb-2 text-[0.6rem] font-medium uppercase tracking-[0.16em] text-primary-foreground/40 sm:text-xs sm:tracking-[0.2em]">
        {label}
      </div>
    </motion.div>
  </motion.button>
);

/* ── Main component ──────────────────────────────────────────────── */
const BookShelf = ({ onSelect, onSelectCalc }: BookShelfProps) => {
  const [hoveredCalc, setHoveredCalc] = useState<number | null>(null);
  const [hoveredBook, setHoveredBook] = useState<number | null>(null);
  const calcRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const bookRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleCalcClick = (type: CalculatorType, i: number) => {
    const el = calcRefs.current[i];
    if (el) onSelectCalc(type, el.getBoundingClientRect());
  };

  const handleBookClick = (degree: number, i: number) => {
    const el = bookRefs.current[i];
    if (el) onSelect(degree, el.getBoundingClientRect());
  };

  const sectionLabel =
    "mb-3 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-muted-foreground";

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative flex min-h-screen flex-col items-center justify-center px-4 overflow-hidden py-16"
    >
      <MathBackground opacity={0.045} />

      {/* ── Calculators section ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3 }}
        className="mb-10 flex flex-col items-center"
      >
        <p className={sectionLabel}>Calculadoras</p>
        <div className="flex w-full items-end justify-center gap-[clamp(0.5rem,2.5vw,1.5rem)] px-[clamp(1rem,4vw,3rem)]">
          {CALC_BOOKS.map((book, i) => (
            <BookSpine
              key={book.type}
              title={book.title}
              subtitle={book.subtitle}
              label={book.subtitle}
              color={book.color}
              hoverSymbol={book.symbol}
              index={i}
              isHovered={hoveredCalc === i}
              isOther={hoveredCalc !== null && hoveredCalc !== i}
              btnRef={el => { calcRefs.current[i] = el; }}
              onMouseEnter={() => setHoveredCalc(i)}
              onMouseLeave={() => setHoveredCalc(null)}
              onClick={() => handleCalcClick(book.type, i)}
            />
          ))}
        </div>
      </motion.div>

      {/* ── Divider ── */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.25, duration: 0.3 }}
        className="mb-10 h-px w-32 bg-border"
      />

      {/* ── Equations section ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="flex flex-col items-center"
      >
        <p className={sectionLabel}>Equações</p>
        <div className="flex w-full items-end justify-center gap-[clamp(0.5rem,2.5vw,1.5rem)] px-[clamp(1rem,4vw,3rem)]">
          {books.map((book, i) => (
            <BookSpine
              key={book.degree}
              title={book.title}
              subtitle={book.subtitle}
              label={`Vol. ${book.degree}`}
              color={book.color}
              hoverSymbol={book.equation}
              index={i + CALC_BOOKS.length}
              isHovered={hoveredBook === i}
              isOther={hoveredBook !== null && hoveredBook !== i}
              btnRef={el => { bookRefs.current[i] = el; }}
              onMouseEnter={() => setHoveredBook(i)}
              onMouseLeave={() => setHoveredBook(null)}
              onClick={() => handleBookClick(book.degree, i)}
            />
          ))}
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-10 max-w-xs px-4 text-center font-serif text-sm italic text-muted-foreground sm:mt-12 sm:max-w-none"
      >
        "Les mathématiques ne sont qu'une histoire de groupes." — Henri Poincaré
      </motion.p>
    </motion.div>
  );
};

export default BookShelf;
