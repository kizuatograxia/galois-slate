import { useState } from "react";
import { useCalculator } from "@/hooks/useCalculator";
import CalcDisplay from "./CalcDisplay";

const EngineeringCalcView = () => {
  const [isDeg, setIsDeg] = useState(true);
  const {
    display, history, pendingOp,
    pressDigit, pressOp, pressEquals,
    pressAllClear, pressBackspace,
    pressToggleSign, pressDecimal, pressPercent, pressSci,
  } = useCalculator();

  const trig = (fn: "sin" | "cos" | "tan") =>
    pressSci(isDeg ? `${fn}_deg` : fn);

  const digit  = "keypad-btn text-sm font-semibold font-mono cursor-pointer select-none";
  const action = "keypad-btn-action text-xs font-medium cursor-pointer select-none";
  const sciBtn = "keypad-btn-action text-xs font-medium cursor-pointer select-none";
  const op = (o: string) =>
    `keypad-btn-action text-sm font-semibold cursor-pointer select-none ${
      pendingOp === o ? "ring-2 ring-accent ring-offset-1" : ""
    }`;
  const solve = "keypad-btn-solve text-sm font-bold cursor-pointer select-none";

  return (
    <div className="whiteboard p-4 sm:p-5 w-full max-w-sm mx-auto">
      <CalcDisplay display={display} history={history} accentColor="hsl(175,48%,10%)" />

      <div className="flex justify-end mb-2">
        <button
          onClick={() => setIsDeg(!isDeg)}
          className="text-xs px-3 py-1 rounded-full font-medium transition-all border border-border"
          style={{
            background: isDeg ? "hsl(var(--accent))" : "hsl(var(--secondary))",
            color: isDeg ? "hsl(var(--accent-foreground))" : "hsl(var(--secondary-foreground))",
          }}
        >
          {isDeg ? "DEG" : "RAD"}
        </button>
      </div>

      <div className="grid grid-cols-5 gap-1.5 mb-1.5">
        <button className={sciBtn} onClick={() => trig("sin")}>sin</button>
        <button className={sciBtn} onClick={() => trig("cos")}>cos</button>
        <button className={sciBtn} onClick={() => trig("tan")}>tan</button>
        <button className={sciBtn} onClick={() => pressSci("log")}>log</button>
        <button className={sciBtn} onClick={() => pressSci("ln")}>ln</button>
      </div>

      <div className="grid grid-cols-5 gap-1.5 mb-3">
        <button className={sciBtn} onClick={() => pressSci("sqrt")}>√</button>
        <button className={sciBtn} onClick={() => pressSci("sq")}>x²</button>
        <button className={sciBtn} onClick={() => pressOp("^")}>xʸ</button>
        <button className={sciBtn} onClick={() => pressSci("pi")}>π</button>
        <button className={sciBtn} onClick={() => pressSci("e")}>e</button>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
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

export default EngineeringCalcView;
