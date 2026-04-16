// Conversion factor tables and category metadata for the Converters section.
// All factors are exact relative to the SI base unit of each category.

export type CategoryKey =
  | "length"
  | "mass"
  | "energy"
  | "volume"
  | "temperature"
  | "speed"
  | "currency"
  | "crypto";

export interface UnitDef {
  /** Internal id, used as <option value>. */
  id: string;
  /** Short label shown in the dropdown (e.g. "km"). */
  label: string;
  /** Full name (tooltip / aria). */
  name: string;
  /** Multiplier to convert *from* this unit to the category base unit. */
  toBase: number;
}

export interface UnitCategory {
  key: Exclude<CategoryKey, "currency" | "crypto">;
  /** Base unit label shown in formulas. */
  baseLabel: string;
  units: UnitDef[];
  /** Optional warning rendered below the result. */
  note?: string;
  /** LaTeX formula displayed in the explanation card. */
  formulaLatex: string;
  /** Short scientific blurb. */
  explanation: string;
}

// --- Length (base: meter) ---
export const lengthCategory: UnitCategory = {
  key: "length",
  baseLabel: "m",
  units: [
    { id: "nm", label: "nm", name: "Nanômetro", toBase: 1e-9 },
    { id: "um", label: "µm", name: "Micrômetro", toBase: 1e-6 },
    { id: "ang", label: "Å", name: "Ångström", toBase: 1e-10 },
    { id: "mm", label: "mm", name: "Milímetro", toBase: 1e-3 },
    { id: "cm", label: "cm", name: "Centímetro", toBase: 1e-2 },
    { id: "m", label: "m", name: "Metro", toBase: 1 },
    { id: "km", label: "km", name: "Quilômetro", toBase: 1000 },
    { id: "in", label: "in", name: "Polegada", toBase: 0.0254 },
    { id: "ft", label: "ft", name: "Pé", toBase: 0.3048 },
    { id: "yd", label: "yd", name: "Jarda", toBase: 0.9144 },
    { id: "mi", label: "mi", name: "Milha", toBase: 1609.344 },
  ],
  formulaLatex: "x_{dest} = x_{orig} \\cdot \\frac{f_{orig}}{f_{dest}}",
  explanation:
    "O metro é a unidade base do SI desde 1983, definido pela distância que a luz percorre no vácuo em 1/299.792.458 de segundo.",
};

// --- Mass (base: kilogram) ---
export const massCategory: UnitCategory = {
  key: "mass",
  baseLabel: "kg",
  units: [
    { id: "mg", label: "mg", name: "Miligrama", toBase: 1e-6 },
    { id: "g", label: "g", name: "Grama", toBase: 1e-3 },
    { id: "kg", label: "kg", name: "Quilograma", toBase: 1 },
    { id: "t", label: "t", name: "Tonelada métrica", toBase: 1000 },
    { id: "grain", label: "grain", name: "Grão", toBase: 6.479891e-5 },
    { id: "oz", label: "oz", name: "Onça", toBase: 0.028349523125 },
    { id: "lb", label: "lb", name: "Libra", toBase: 0.45359237 },
    { id: "st", label: "st", name: "Stone", toBase: 6.35029318 },
  ],
  formulaLatex: "m_{kg} = m_{orig} \\cdot f_{orig}",
  explanation:
    "Desde 2019 o quilograma é definido pela constante de Planck (h = 6{,}62607015 \\times 10^{-34} \\,\\mathrm{J\\,s}), substituindo o cilindro padrão de Sèvres.",
};

// --- Energy (base: joule) ---
export const energyCategory: UnitCategory = {
  key: "energy",
  baseLabel: "J",
  units: [
    { id: "eV", label: "eV", name: "Elétron-volt", toBase: 1.602176634e-19 },
    { id: "J", label: "J", name: "Joule", toBase: 1 },
    { id: "kJ", label: "kJ", name: "Quilojoule", toBase: 1000 },
    { id: "MJ", label: "MJ", name: "Megajoule", toBase: 1e6 },
    { id: "GJ", label: "GJ", name: "Gigajoule", toBase: 1e9 },
    { id: "cal", label: "cal", name: "Caloria", toBase: 4.184 },
    { id: "kcal", label: "kcal", name: "Quilocaloria", toBase: 4184 },
    { id: "Wh", label: "Wh", name: "Watt-hora", toBase: 3600 },
    { id: "kWh", label: "kWh", name: "Quilowatt-hora", toBase: 3.6e6 },
    { id: "BTU", label: "BTU", name: "British Thermal Unit", toBase: 1055.05585262 },
  ],
  formulaLatex: "E_{J} = E_{orig} \\cdot f_{orig}",
  explanation:
    "1 joule é o trabalho realizado por uma força de 1 N ao deslocar 1 m. A relação E = mc² conecta massa e energia em escala universal.",
};

// --- Volume (base: liter) ---
export const volumeCategory: UnitCategory = {
  key: "volume",
  baseLabel: "L",
  units: [
    { id: "mL", label: "mL", name: "Mililitro", toBase: 1e-3 },
    { id: "L", label: "L", name: "Litro", toBase: 1 },
    { id: "m3", label: "m³", name: "Metro cúbico", toBase: 1000 },
    { id: "ft3", label: "ft³", name: "Pé cúbico", toBase: 28.316846592 },
    { id: "gal", label: "gal", name: "Galão (US)", toBase: 3.785411784 },
    { id: "floz", label: "fl oz", name: "Onça fluida (US)", toBase: 0.0295735295625 },
    { id: "cup", label: "cup", name: "Xícara (US)", toBase: 0.2365882365 },
    { id: "pt", label: "pt", name: "Pinta (US)", toBase: 0.473176473 },
    { id: "qt", label: "qt", name: "Quart (US)", toBase: 0.946352946 },
    { id: "bbl", label: "bbl", name: "Barril de petróleo", toBase: 158.987294928 },
  ],
  note: "Para conversão volume ↔ massa assumimos água pura (ρ = 1 kg/L).",
  formulaLatex: "V_{L} = V_{orig} \\cdot f_{orig}",
  explanation:
    "1 litro equivale a 1 dm³, ou 0,001 m³. O barril de petróleo (bbl) é definido como 42 galões americanos.",
};

// --- Speed (base: m/s) ---
export const speedCategory: UnitCategory = {
  key: "speed",
  baseLabel: "m/s",
  units: [
    { id: "ms", label: "m/s", name: "Metros por segundo", toBase: 1 },
    { id: "kmh", label: "km/h", name: "Quilômetros por hora", toBase: 1 / 3.6 },
    { id: "mph", label: "mph", name: "Milhas por hora", toBase: 0.44704 },
    { id: "kn", label: "kn", name: "Nó (knot)", toBase: 0.514444444 },
    { id: "fts", label: "ft/s", name: "Pés por segundo", toBase: 0.3048 },
    { id: "mach", label: "Mach", name: "Mach (a 0 °C ao nível do mar)", toBase: 343 },
  ],
  formulaLatex: "v_{m/s} = v_{orig} \\cdot f_{orig}",
  explanation:
    "Mach 1 ≈ 343 m/s ao nível do mar a 20 °C. A velocidade da luz, c ≈ 299.792.458 m/s, é o limite superior absoluto do universo conhecido.",
};

// --- Temperature (special: not multiplicative) ---
export interface TemperatureUnit {
  id: "C" | "F" | "K" | "R";
  label: string;
  name: string;
}

export const temperatureUnits: TemperatureUnit[] = [
  { id: "C", label: "°C", name: "Celsius" },
  { id: "F", label: "°F", name: "Fahrenheit" },
  { id: "K", label: "K", name: "Kelvin" },
  { id: "R", label: "°R", name: "Rankine" },
];

export const temperatureFormulaLatex =
  "T_K = T_C + 273{,}15 \\quad T_F = \\tfrac{9}{5}T_C + 32 \\quad T_R = \\tfrac{9}{5}(T_C + 273{,}15)";

export const temperatureExplanation =
  "O zero absoluto (0 K = −273,15 °C) é o limite teórico em que toda agitação térmica cessa. As escalas Celsius e Fahrenheit foram criadas no século XVIII, antes da formalização da termodinâmica moderna.";

export const convertTemperature = (value: number, from: TemperatureUnit["id"], to: TemperatureUnit["id"]): number => {
  // Step 1 → Celsius
  let c: number;
  switch (from) {
    case "C": c = value; break;
    case "F": c = (value - 32) * 5 / 9; break;
    case "K": c = value - 273.15; break;
    case "R": c = (value - 491.67) * 5 / 9; break;
  }
  // Step 2 → target
  switch (to) {
    case "C": return c;
    case "F": return c * 9 / 5 + 32;
    case "K": return c + 273.15;
    case "R": return (c + 273.15) * 9 / 5;
  }
};

// Generic linear converter for length/mass/energy/volume/speed.
export const convertLinear = (value: number, from: UnitDef, to: UnitDef): number => {
  return (value * from.toBase) / to.toBase;
};

// --- Notebook visual metadata for the shelf ---
export interface NotebookMeta {
  key: CategoryKey;
  title: string;
  subtitle: string;
  /** Tailwind gradient class. */
  color: string;
  /** Lucide icon name (resolved in the component). */
  icon:
    | "Ruler"
    | "Scale"
    | "Zap"
    | "Droplets"
    | "Thermometer"
    | "Gauge"
    | "Coins"
    | "Bitcoin";
}

export const notebooks: NotebookMeta[] = [
  { key: "length", title: "Comprimento", subtitle: "Distância e escala", color: "from-[hsl(160,50%,20%)] to-[hsl(160,40%,30%)]", icon: "Ruler" },
  { key: "mass", title: "Massa", subtitle: "Peso e matéria", color: "from-[hsl(30,60%,25%)] to-[hsl(30,50%,35%)]", icon: "Scale" },
  { key: "energy", title: "Energia", subtitle: "Trabalho e calor", color: "from-[hsl(270,50%,25%)] to-[hsl(270,40%,35%)]", icon: "Zap" },
  { key: "volume", title: "Volume", subtitle: "Fluidos e capacidade", color: "from-[hsl(200,60%,20%)] to-[hsl(200,50%,30%)]", icon: "Droplets" },
  { key: "temperature", title: "Temperatura", subtitle: "Calor e frio", color: "from-[hsl(0,60%,25%)] to-[hsl(0,50%,35%)]", icon: "Thermometer" },
  { key: "speed", title: "Velocidade", subtitle: "Movimento", color: "from-[hsl(190,60%,20%)] to-[hsl(190,50%,30%)]", icon: "Gauge" },
  { key: "currency", title: "Moedas", subtitle: "Câmbio em tempo real", color: "from-[hsl(45,70%,20%)] to-[hsl(45,60%,30%)]", icon: "Coins" },
  { key: "crypto", title: "Cripto", subtitle: "Ativos digitais", color: "from-[hsl(250,70%,20%)] to-[hsl(250,55%,32%)]", icon: "Bitcoin" },
];

export type LinearCategoryKey = "length" | "mass" | "energy" | "volume" | "speed";

export const linearCategories: Record<LinearCategoryKey, UnitCategory> = {
  length: lengthCategory,
  mass: massCategory,
  energy: energyCategory,
  volume: volumeCategory,
  speed: speedCategory,
};
