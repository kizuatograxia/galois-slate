import { useState } from "react";
import { motion } from "framer-motion";

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
  onSelect: (degree: number) => void;
}

const BookShelf = ({ onSelect }: BookShelfProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-3 font-serif text-5xl font-semibold tracking-tight text-primary md:text-6xl"
      >
        Galois Canvas
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-16 text-lg text-muted-foreground"
      >
        Selecione o grau da equação
      </motion.p>

      <div className="flex items-end gap-4 md:gap-6">
        {books.map((book, i) => {
          const isHovered = hovered === i;
          const isOther = hovered !== null && hovered !== i;

          return (
            <motion.button
              key={book.degree}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect(book.degree)}
              className="group relative cursor-pointer focus:outline-none"
              style={{ transformOrigin: "bottom center" }}
            >
              <motion.div
                animate={{
                  width: isHovered ? 220 : 150,
                  opacity: isOther ? 0.6 : 1,
                  scale: isHovered ? 1.05 : isOther ? 0.97 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`relative flex h-[320px] flex-col items-center justify-between overflow-hidden rounded-lg bg-gradient-to-b ${book.color} p-6 md:h-[380px]`}
                style={{
                  boxShadow: isHovered
                    ? "0 12px 50px -10px hsla(213, 70%, 30%, 0.35), 4px 0 15px -5px hsla(213, 70%, 30%, 0.1)"
                    : "0 8px 40px -8px hsla(215, 40%, 20%, 0.2)",
                }}
              >
                {/* Spine line */}
                <div className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-transparent via-primary-foreground/20 to-transparent" />

                <div className="mt-4 flex flex-col items-center">
                  <span className="font-serif text-4xl font-bold tracking-wider text-primary-foreground/90 md:text-5xl">
                    {book.title}
                  </span>
                </div>

                <motion.div
                  animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center text-center"
                >
                  <span className="text-sm font-medium tracking-wide text-primary-foreground/80">
                    {book.subtitle}
                  </span>
                  <span className="mt-2 font-chalk text-xl text-primary-foreground/70">
                    {book.equation}
                  </span>
                </motion.div>

                <div className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/40">
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
        className="mt-12 font-serif text-sm italic text-muted-foreground"
      >
        "Les mathématiques ne sont qu'une histoire de groupes." — Henri Poincaré
      </motion.p>
    </div>
  );
};

export default BookShelf;
