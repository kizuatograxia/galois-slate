import { useState, useRef } from "react";
import { motion } from "framer-motion";
import MathBackground from "./MathBackground";

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
}

const BookShelf = ({ onSelect }: BookShelfProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const bookRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleClick = (book: Book, i: number) => {
    const el = bookRefs.current[i];
    if (el) {
      const rect = el.getBoundingClientRect();
      onSelect(book.degree, rect);
    }
  };

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative flex min-h-screen flex-col items-center justify-center px-4 overflow-hidden"
    >
      <MathBackground opacity={0.045} />
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-2 px-4 text-center font-serif text-4xl font-semibold tracking-tight text-primary sm:text-5xl md:text-6xl"
      >
        Galois Canvas
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-8 px-4 text-center text-base text-muted-foreground sm:mb-12 sm:text-lg md:mb-16"
      >
        Selecione o grau da equação
      </motion.p>

      <div className="flex w-full items-end justify-center gap-[clamp(0.5rem,2.5vw,1.5rem)] px-[clamp(1rem,4vw,3rem)]">
        {books.map((book, i) => {
          const isHovered = hovered === i;
          const isOther = hovered !== null && hovered !== i;

          return (
            <motion.button
              key={book.degree}
              ref={(el) => { bookRefs.current[i] = el; }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleClick(book, i)}
              className="group relative cursor-pointer focus:outline-none"
              style={{ transformOrigin: "bottom center" }}
            >
              <motion.div
                animate={{
                  opacity: isOther ? 0.6 : 1,
                  scale: isHovered ? 1.04 : isOther ? 0.98 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`relative flex h-[min(48vh,320px)] w-[clamp(5rem,24vw,8.5rem)] flex-col items-center justify-between overflow-hidden rounded-lg bg-gradient-to-b ${book.color} p-3 sm:p-4 md:h-[380px] md:p-6`}
                style={{
                  boxShadow: isHovered
                    ? "0 12px 50px -10px hsla(213, 70%, 30%, 0.35), 4px 0 15px -5px hsla(213, 70%, 30%, 0.1)"
                    : "0 8px 40px -8px hsla(215, 40%, 20%, 0.2)",
                }}
              >
                <div className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-transparent via-primary-foreground/20 to-transparent" />

                <div className="mt-4 flex flex-col items-center">
                  <span className="font-serif text-3xl font-bold tracking-wider text-primary-foreground/90 sm:text-4xl md:text-5xl">
                    {book.title}
                  </span>
                </div>

                <motion.div
                  animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                  transition={{ duration: 0.3 }}
                  className="hidden flex-col items-center text-center md:flex"
                >
                  <span className="text-sm font-medium tracking-wide text-primary-foreground/80">
                    {book.subtitle}
                  </span>
                  <span className="mt-2 font-chalk text-xl text-primary-foreground/70">
                    {book.equation}
                  </span>
                </motion.div>

                <div className="mb-2 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-primary-foreground/40 sm:text-xs sm:tracking-[0.2em]">
                  Vol. {book.degree}
                </div>
              </motion.div>
            </motion.button>
          );
        })}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 max-w-xs px-4 text-center font-serif text-sm italic text-muted-foreground sm:mt-12 sm:max-w-none"
      >
        "Les mathématiques ne sont qu'une histoire de groupes." — Henri Poincaré
      </motion.p>
    </motion.div>
  );
};

export default BookShelf;
