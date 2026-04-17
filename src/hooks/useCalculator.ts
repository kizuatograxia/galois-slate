import { useReducer, useCallback } from "react";

interface CalcState {
  display: string;
  prevValue: number | null;
  pendingOp: string | null;
  justEvaluated: boolean;
  history: string;
}

const INITIAL: CalcState = {
  display: "0",
  prevValue: null,
  pendingOp: null,
  justEvaluated: false,
  history: "",
};

type CalcAction =
  | { type: "DIGIT"; d: string }
  | { type: "OP"; op: string }
  | { type: "EQUALS" }
  | { type: "CLEAR" }
  | { type: "ALL_CLEAR" }
  | { type: "BACKSPACE" }
  | { type: "TOGGLE_SIGN" }
  | { type: "DECIMAL" }
  | { type: "PERCENT" }
  | { type: "SCI"; fn: string };

function fmt(n: number): string {
  if (!isFinite(n)) return isNaN(n) ? "Erro" : n > 0 ? "∞" : "-∞";
  return parseFloat(n.toPrecision(12)).toString();
}

function applyOp(a: number, op: string, b: number): number {
  switch (op) {
    case "+": return a + b;
    case "−": return a - b;
    case "×": return a * b;
    case "÷": return b !== 0 ? a / b : NaN;
    case "^": return Math.pow(a, b);
    default:  return b;
  }
}

function reducer(state: CalcState, action: CalcAction): CalcState {
  const cur = parseFloat(state.display) || 0;

  switch (action.type) {
    case "DIGIT": {
      if (state.justEvaluated) return { ...state, display: action.d, justEvaluated: false };
      if (state.display === "0") return { ...state, display: action.d };
      if (state.display.length >= 15) return state;
      return { ...state, display: state.display + action.d };
    }
    case "DECIMAL": {
      if (state.justEvaluated) return { ...state, display: "0.", justEvaluated: false };
      if (state.display.includes(".")) return state;
      return { ...state, display: state.display + "." };
    }
    case "TOGGLE_SIGN": {
      if (state.display === "0") return state;
      const t = state.display.startsWith("-") ? state.display.slice(1) : "-" + state.display;
      return { ...state, display: t };
    }
    case "PERCENT":
      return { ...state, display: fmt(cur / 100), justEvaluated: true };

    case "OP": {
      // Chain: if there's already a pending op and user hasn't started typing, just swap op
      if (state.pendingOp && state.justEvaluated) {
        return { ...state, pendingOp: action.op, history: `${state.display} ${action.op}` };
      }
      // If pending op, evaluate first
      if (state.pendingOp && state.prevValue !== null && !state.justEvaluated) {
        const result = applyOp(state.prevValue, state.pendingOp, cur);
        return {
          display: fmt(result),
          prevValue: result,
          pendingOp: action.op,
          justEvaluated: true,
          history: `${fmt(result)} ${action.op}`,
        };
      }
      return {
        ...state,
        prevValue: cur,
        pendingOp: action.op,
        justEvaluated: true,
        history: `${state.display} ${action.op}`,
      };
    }
    case "EQUALS": {
      if (state.pendingOp === null || state.prevValue === null) return state;
      const result = applyOp(state.prevValue, state.pendingOp, cur);
      return {
        display: fmt(result),
        prevValue: null,
        pendingOp: null,
        justEvaluated: true,
        history: `${state.history} ${state.display} =`,
      };
    }
    case "CLEAR":
      return { ...state, display: "0" };
    case "ALL_CLEAR":
      return INITIAL;
    case "BACKSPACE": {
      if (state.display.length === 1 || state.display === "-0") return { ...state, display: "0" };
      return { ...state, display: state.display.slice(0, -1) };
    }
    case "SCI": {
      const DEG = Math.PI / 180;
      let result: number;
      switch (action.fn) {
        case "sin":     result = Math.sin(cur); break;
        case "cos":     result = Math.cos(cur); break;
        case "tan":     result = Math.tan(cur); break;
        case "sin_deg": result = Math.sin(cur * DEG); break;
        case "cos_deg": result = Math.cos(cur * DEG); break;
        case "tan_deg": result = Math.tan(cur * DEG); break;
        case "log":   result = Math.log10(cur); break;
        case "ln":    result = Math.log(cur); break;
        case "sqrt":  result = Math.sqrt(cur); break;
        case "sq":    result = cur * cur; break;
        case "inv":   result = cur !== 0 ? 1 / cur : NaN; break;
        case "pi":    return { ...state, display: fmt(Math.PI), justEvaluated: false };
        case "e":     return { ...state, display: fmt(Math.E), justEvaluated: false };
        default:      return state;
      }
      return { ...state, display: fmt(result), justEvaluated: true };
    }
    default:
      return state;
  }
}

export function useCalculator() {
  const [state, dispatch] = useReducer(reducer, INITIAL);

  return {
    display:    state.display,
    history:    state.history,
    pendingOp:  state.pendingOp,

    pressDigit:     useCallback((d: string)  => dispatch({ type: "DIGIT", d }),  []),
    pressOp:        useCallback((op: string) => dispatch({ type: "OP", op }),    []),
    pressEquals:    useCallback(()           => dispatch({ type: "EQUALS" }),    []),
    pressClear:     useCallback(()           => dispatch({ type: "CLEAR" }),     []),
    pressAllClear:  useCallback(()           => dispatch({ type: "ALL_CLEAR" }), []),
    pressBackspace: useCallback(()           => dispatch({ type: "BACKSPACE" }), []),
    pressToggleSign:useCallback(()           => dispatch({ type: "TOGGLE_SIGN" }),[]),
    pressDecimal:   useCallback(()           => dispatch({ type: "DECIMAL" }),   []),
    pressPercent:   useCallback(()           => dispatch({ type: "PERCENT" }),   []),
    pressSci:       useCallback((fn: string) => dispatch({ type: "SCI", fn }),   []),
  };
}
