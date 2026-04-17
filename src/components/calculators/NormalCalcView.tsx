import { useCalculator } from "@/hooks/useCalculator";
import CalcDisplay from "./CalcDisplay";

const NormalCalcView = () => {
  const {
    display, history, pendingOp,
    pressDigit, pressOp, pressEquals,
    pressAllClear, pressBackspace,
    pressToggleSign, pressDecimal, pressPercent,
  } = useCalculator();

  const digit =
    "keypad-btn text-base font-semibold font-mono cursor-pointer select-none";
  const action =
    "keypad-btn-action text-sm font-medium cursor-pointer select-none";
  const op = (o: string) =>
    `keypad-btn-action text-base font-semibold cursor-pointer select-none transition-all ${
      pendingOp === o ? "ring-2 ring-accent ring-offset-1" : ""
    }`;
  const solve =
    "keypad-btn-solve text-base font-bold cursor-pointer select-none";

  return (
    <div className="whiteboard p-4 sm:p-6 w-full max-w-xs mx-auto">
      <CalcDisplay display={display} history={history} accentColor="hsl(220,18%,18%)" />

      <div className="grid grid-cols-4 gap-2">
        <button className={action} onClick={pressAllClear}>AC</button>
        <button className={action} onClick={pressToggleSign}>±</button>
        <button className={action} onClick={pressPercent}>%</button>
        <button className={op("÷")} onClick={() => pressOp("÷")}>÷</button>

        {["7","8","9"].map(d => (
          <button key={d} className={digit} onClick={() => pressDigit(d)}>{d}</button>
        ))}
        <button className={op("×")} onClick={() => pressOp("×")}>×</button>

        {["4","5","6"].map(d => (
          <button key={d} className={digit} onClick={() => pressDigit(d)}>{d}</button>
        ))}
        <button className={op("−")} onClick={() => pressOp("−")}>−</button>

        {["1","2","3"].map(d => (
          <button key={d} className={digit} onClick={() => pressDigit(d)}>{d}</button>
        ))}
        <button className={op("+")} onClick={() => pressOp("+")}>+</button>

        <button className={action} onClick={pressBackspace}>⌫</button>
        <button className={digit} onClick={() => pressDigit("0")}>0</button>
        <button className={digit} onClick={pressDecimal}>,</button>
        <button className={solve} onClick={pressEquals}>=</button>
      </div>
    </div>
  );
};

export default NormalCalcView;
