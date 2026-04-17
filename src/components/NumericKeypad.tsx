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

// Plain buttons — hover/active handled by CSS classes (GPU-composited)
// Removing motion.button eliminates 12 Framer Motion animation targets
const NumericKeypad = ({ onKey, onDelete, onClear, onSolve }: NumericKeypadProps) => {
  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="grid grid-cols-3 gap-2">
        {keys.map((row) =>
          row.map((key) => (
            <button
              key={key}
              onClick={() => onKey(key)}
              className="keypad-btn font-chalk text-2xl"
            >
              {key}
            </button>
          ))
        )}
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2">
        <button
          onClick={onDelete}
          className="keypad-btn-action font-sans text-sm font-medium"
        >
          ⌫
        </button>
        <button
          onClick={onClear}
          className="keypad-btn-action font-sans text-sm font-medium"
        >
          C
        </button>
        <button
          onClick={onSolve}
          className="keypad-btn-solve font-serif text-lg font-semibold"
        >
          Resolver
        </button>
      </div>
    </div>
  );
};

export default NumericKeypad;
