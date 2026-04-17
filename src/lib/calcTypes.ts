export type CalculatorType = "normal" | "engineering" | "financial";

export interface CalcBook {
  type: CalculatorType;
  /** Roman numeral or short label shown on spine */
  title: string;
  subtitle: string;
  /** Symbol shown on the book face when hovered */
  symbol: string;
  /** Tailwind bg-gradient class for the book spine */
  color: string;
  /** Tailwind bg-gradient class for the expanded-view background */
  expandedColor: string;
}

export const CALC_BOOKS: CalcBook[] = [
  {
    type: "normal",
    title: "I",
    subtitle: "Calculadora",
    symbol: "+",
    color: "from-[hsl(220,18%,20%)] to-[hsl(220,18%,32%)]",
    expandedColor: "from-[hsl(220,18%,10%)] to-[hsl(220,18%,22%)]",
  },
  {
    type: "engineering",
    title: "II",
    subtitle: "Engenharia",
    symbol: "∑",
    color: "from-[hsl(175,48%,13%)] to-[hsl(175,48%,23%)]",
    expandedColor: "from-[hsl(175,48%,7%)] to-[hsl(175,48%,17%)]",
  },
  {
    type: "financial",
    title: "III",
    subtitle: "Finanças",
    symbol: "%",
    color: "from-[hsl(145,40%,13%)] to-[hsl(145,40%,23%)]",
    expandedColor: "from-[hsl(145,40%,7%)] to-[hsl(145,40%,17%)]",
  },
];
