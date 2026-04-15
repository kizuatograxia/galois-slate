import { motion } from "framer-motion";

interface NumericKeypadProps {
  onKey: (key: string) => void;
  onDelete: () => void;
  onClear: () => void;
  onSolve: () => void;
}

const keys = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  ["±", "0", "."],
];

const NumericKeypad = ({ onKey, onDelete, onClear, onSolve }: NumericKeypadProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="w-full max-w-xs mx-auto"
    >
      <div className="grid grid-cols-4 gap-2">
        {keys.map((row, ri) =>
          row.map((key) => (
            <motion.button
              key={key}
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => onKey(key)}
              className="keypad-btn font-chalk text-2xl"
            >
              {key}
            </motion.button>
          ))
        )}
        {/* Right column: action keys */}
      </div>

      {/* Action row */}
      <div className="mt-2 grid grid-cols-3 gap-2">
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          onClick={onDelete}
          className="keypad-btn-action font-sans text-sm font-medium"
        >
          ⌫
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          onClick={onClear}
          className="keypad-btn-action font-sans text-sm font-medium"
        >
          C
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          onClick={onSolve}
          className="keypad-btn-solve font-serif text-lg font-semibold"
        >
          Resolver
        </motion.button>
      </div>
    </motion.div>
  );
};

export default NumericKeypad;
