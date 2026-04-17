import type { Question, TopicKey, Difficulty } from "./academiaTypes";

// ─── Utilities ────────────────────────────────────────────────────────────────

const rng = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = <T>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const makeOptions = (
  correct: string,
  distractors: string[]
): { options: string[]; correctIndex: number } => {
  const seen = new Set<string>([correct]);
  const pool: string[] = [correct];
  for (const d of distractors) {
    if (!seen.has(d) && pool.length < 4) {
      pool.push(d);
      seen.add(d);
    }
  }
  // Pad with simple numbers if not enough unique distractors
  let pad = 1;
  while (pool.length < 4) {
    const fb = String(pad++);
    if (!seen.has(fb)) { pool.push(fb); seen.add(fb); }
  }
  const shuffled = shuffle(pool);
  return { options: shuffled, correctIndex: shuffled.indexOf(correct) };
};

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const xpFor = (d: Difficulty): number =>
  d === "iniciante" ? 10 : d === "intermediario" ? 20 : 35;

const makeId = (topic: TopicKey, d: Difficulty, i: number) =>
  `${topic}_${d}_${i}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

// ─── Historical notes ─────────────────────────────────────────────────────────

const histNotes: Record<TopicKey, string[]> = {
  aritmetica: [
    "Brahmagupta (628 d.C.) foi o primeiro matemático a formalizar regras para o zero e números negativos.",
    "Os babilônios usavam um sistema numérico de base 60 há mais de 4000 anos — herdamos isso nos minutos e segundos.",
    "Euclides provou que existem infinitos números primos por volta de 300 a.C., em Os Elementos.",
    "O conceito de fração já era usado no antigo Egito, no papiro de Ahmes (circa 1650 a.C.).",
    "Fibonacci introduziu os algarismos arábicos na Europa no século XIII, revolucionando o comércio.",
  ],
  algebra: [
    "A palavra 'álgebra' vem do árabe al-jabr, do tratado de Al-Khwārizmī de 830 d.C.",
    "Bhaskara II, matemático indiano do século XII, introduziu a fórmula quadrática que usamos até hoje.",
    "Galois morreu aos 20 anos em um duelo em 1832, deixando a teoria que hoje leva seu nome.",
    "René Descartes introduziu a notação de expoentes (x²) em 1637 no Discours de la Méthode.",
    "Omar Khayyam resolveu equações cúbicas geometricamente no século XI, antes de Cardano.",
  ],
  geometria: [
    "Pitágoras não foi o primeiro a descobrir seu teorema — os babilônios já o usavam 1000 anos antes.",
    "Euclides escreveu Os Elementos por volta de 300 a.C., base da geometria ensinada até hoje.",
    "O número π foi calculado por Arquimedes com apenas polígonos de 96 lados por volta de 250 a.C.",
    "Gauss provou aos 19 anos que o heptadecágono regular (17 lados) pode ser construído com régua e compasso.",
    "A geometria não-euclidiana de Riemann foi a base matemática da Teoria da Relatividade de Einstein.",
  ],
  trigonometria: [
    "Leonhard Euler introduziu a notação sin, cos e a função f(x) no século XVIII.",
    "Hipárquias de Niceia (séc. II a.C.) criou a primeira tabela de cordas, precursora das tabelas trigonométricas.",
    "A identidade de Euler, eⁱᵖ + 1 = 0, é considerada a equação mais bela da matemática.",
    "Os árabes medievais traduziram e expandiram o trabalho trigonométrico grego, salvando-o para a posteridade.",
    "A palavra 'seno' vem do árabe jiba, que foi mal traduzido para o latim sinus (seio) no século XII.",
  ],
  probabilidade: [
    "Pascal e Fermat fundaram a teoria da probabilidade em 1654 através de cartas sobre jogos de azar.",
    "Bayes publicou seu famoso teorema postumamente em 1763, mudando para sempre a estatística inferencial.",
    "A distribuição normal foi descoberta por Abraham de Moivre em 1733 estudando jogos de moeda.",
    "Laplace aplicou probabilidade à astronomia e demonstrou a estabilidade do sistema solar em 1799.",
    "O paradoxo do aniversário mostra que 23 pessoas já têm 50% de chance de dois fazerem aniversário no mesmo dia.",
  ],
};

const pickNote = (topic: TopicKey, i: number): string => {
  const notes = histNotes[topic];
  return notes[i % notes.length];
};

// ─── Aritmética ───────────────────────────────────────────────────────────────

const genAritmetica = (difficulty: Difficulty, count: number): Question[] => {
  const qs: Question[] = [];
  for (let i = 0; i < count; i++) {
    const note = pickNote("aritmetica", i);
    const xp = xpFor(difficulty);
    let q: Question;

    if (difficulty === "iniciante") {
      const op = rng(0, 1) === 0 ? "+" : "-";
      const a = rng(1, 50);
      const b = rng(1, 50);
      const correct = op === "+" ? a + b : a - b;
      const dist = [correct + 1, correct - 1, correct + 2, correct - 2]
        .filter((d) => d !== correct)
        .map(String);
      const { options, correctIndex } = makeOptions(String(correct), dist);
      q = {
        id: makeId("aritmetica", difficulty, i),
        topic: "aritmetica", difficulty, xpReward: xp, historicalNote: note,
        prompt: `Quanto é ${a} ${op} ${b}?`,
        options, correctIndex,
        explanation: `${a} ${op} ${b} = ${correct}`,
      };
    } else if (difficulty === "intermediario") {
      const type = rng(0, 2);
      if (type === 0) {
        // Multiplicação
        const a = rng(2, 12), b = rng(2, 12);
        const correct = a * b;
        const dist = [correct + a, correct - b, correct + b + 1, a * (b + 1)]
          .filter((d) => d !== correct).map(String);
        const { options, correctIndex } = makeOptions(String(correct), dist);
        q = {
          id: makeId("aritmetica", difficulty, i),
          topic: "aritmetica", difficulty, xpReward: xp, historicalNote: note,
          prompt: `Quanto é ${a} × ${b}?`,
          options, correctIndex,
          explanation: `${a} × ${b} = ${correct}`,
        };
      } else if (type === 1) {
        // Divisão exata
        const b = rng(2, 9), correct = rng(2, 9);
        const a = b * correct;
        const dist = [correct + 1, correct - 1, b, a]
          .filter((d) => d !== correct).map(String);
        const { options, correctIndex } = makeOptions(String(correct), dist);
        q = {
          id: makeId("aritmetica", difficulty, i),
          topic: "aritmetica", difficulty, xpReward: xp, historicalNote: note,
          prompt: `Quanto é ${a} ÷ ${b}?`,
          options, correctIndex,
          explanation: `${a} ÷ ${b} = ${correct}`,
        };
      } else {
        // Frações
        const denoms = [2, 3, 4, 5, 6];
        const b1 = denoms[rng(0, 4)], b2 = denoms[rng(0, 4)];
        const a1 = rng(1, b1 - 1), a2 = rng(1, b2 - 1);
        const numFrac = a1 * b2 + a2 * b1, denFrac = b1 * b2;
        const g = gcd(numFrac, denFrac);
        const rNum = numFrac / g, rDen = denFrac / g;
        const correctStr = rDen === 1 ? String(rNum) : `${rNum}/${rDen}`;
        const fracPool = ["1/2","2/3","3/4","5/6","7/8","1/3","3/5","4/5","11/6","5/4","7/6","2"]
          .filter((f) => f !== correctStr);
        const { options, correctIndex } = makeOptions(correctStr, fracPool);
        q = {
          id: makeId("aritmetica", difficulty, i),
          topic: "aritmetica", difficulty, xpReward: xp, historicalNote: note,
          prompt: `Calcule: ${a1}/${b1} + ${a2}/${b2}`,
          promptLatex: `\\frac{${a1}}{${b1}} + \\frac{${a2}}{${b2}}`,
          options, correctIndex,
          explanation: `${a1}/${b1} + ${a2}/${b2} = ${numFrac}/${denFrac} = ${rNum}/${rDen}`,
          explanationLatex: `\\frac{${a1}}{${b1}} + \\frac{${a2}}{${b2}} = \\frac{${numFrac}}{${denFrac}} = \\frac{${rNum}}{${rDen}}`,
        };
      }
    } else {
      // Avançado
      const type = rng(0, 2);
      if (type === 0) {
        const base = rng(2, 9), exp = rng(2, 4);
        const correct = Math.pow(base, exp);
        const dist = [correct + base, correct - base, base * exp, Math.pow(base, exp - 1)]
          .filter((d) => d !== correct && d > 0).map(String);
        const { options, correctIndex } = makeOptions(String(correct), dist);
        q = {
          id: makeId("aritmetica", difficulty, i),
          topic: "aritmetica", difficulty, xpReward: xp, historicalNote: note,
          prompt: `Quanto é ${base}^${exp}?`,
          promptLatex: `${base}^{${exp}}`,
          options, correctIndex,
          explanation: `${base}^${exp} = ${correct}`,
          explanationLatex: `${base}^{${exp}} = ${correct}`,
        };
      } else if (type === 1) {
        const perfectSqs = [4,9,16,25,36,49,64,81,100,121,144,169];
        const sq = perfectSqs[rng(0, perfectSqs.length - 1)];
        const correct = Math.sqrt(sq);
        const dist = [correct + 1, correct - 1, correct + 2, Math.round(sq / correct)]
          .filter((d) => d !== correct && d > 0).map(String);
        const { options, correctIndex } = makeOptions(String(correct), dist);
        q = {
          id: makeId("aritmetica", difficulty, i),
          topic: "aritmetica", difficulty, xpReward: xp, historicalNote: note,
          prompt: `Quanto é √${sq}?`,
          promptLatex: `\\sqrt{${sq}}`,
          options, correctIndex,
          explanation: `√${sq} = ${correct} pois ${correct}² = ${sq}`,
          explanationLatex: `\\sqrt{${sq}} = ${correct} \\;(${correct}^2 = ${sq})`,
        };
      } else {
        const a = rng(6, 48), b = rng(6, 48);
        const correct = gcd(a, b);
        const dist = [2, 3, 4, 6, 8, 12, 1].filter((d) => d !== correct).map(String);
        const { options, correctIndex } = makeOptions(String(correct), dist);
        q = {
          id: makeId("aritmetica", difficulty, i),
          topic: "aritmetica", difficulty, xpReward: xp, historicalNote: note,
          prompt: `Qual é o MDC (máximo divisor comum) de ${a} e ${b}?`,
          options, correctIndex,
          explanation: `MDC(${a}, ${b}) = ${correct}. Use o algoritmo de Euclides: divida o maior pelo menor repetidamente.`,
        };
      }
    }

    qs.push(q);
  }
  return qs;
};

// ─── Álgebra ──────────────────────────────────────────────────────────────────

const fmtEq = (a: number, b: number, c?: number): string => {
  let s = `${a}x²`;
  if (b > 0) s += ` + ${b}x`;
  else if (b < 0) s += ` - ${Math.abs(b)}x`;
  if (c !== undefined) {
    if (c > 0) s += ` + ${c}`;
    else if (c < 0) s += ` - ${Math.abs(c)}`;
  }
  return s;
};

const fmtEqLatex = (a: number, b: number, c?: number): string => {
  let s = a === 1 ? "x^2" : `${a}x^2`;
  if (b > 0) s += ` + ${b}x`;
  else if (b < 0) s += ` - ${Math.abs(b)}x`;
  if (c !== undefined) {
    if (c > 0) s += ` + ${c}`;
    else if (c < 0) s += ` - ${Math.abs(c)}`;
  }
  return s;
};

const genAlgebra = (difficulty: Difficulty, count: number): Question[] => {
  const qs: Question[] = [];
  for (let i = 0; i < count; i++) {
    const note = pickNote("algebra", i);
    const xp = xpFor(difficulty);
    let q: Question;

    if (difficulty === "iniciante") {
      const a = rng(1, 9);
      const x = rng(-10, 10);
      const b = -a * x;
      const bStr = b > 0 ? `+ ${b}` : b < 0 ? `- ${Math.abs(b)}` : "";
      const dist = [x + 1, x - 1, x + 2, -x].filter((d) => d !== x).map(String);
      const { options, correctIndex } = makeOptions(String(x), dist);
      q = {
        id: makeId("algebra", difficulty, i),
        topic: "algebra", difficulty, xpReward: xp, historicalNote: note,
        prompt: `Resolva: ${a}x ${bStr} = 0`,
        promptLatex: `${a}x ${bStr} = 0`,
        options, correctIndex,
        explanation: `${a}x = ${-b} → x = ${-b} ÷ ${a} = ${x}`,
        explanationLatex: `${a}x = ${-b} \\Rightarrow x = \\frac{${-b}}{${a}} = ${x}`,
      };
    } else if (difficulty === "intermediario") {
      // Discriminante
      const a = rng(1, 4), b = rng(-8, 8), c = rng(-8, 8);
      const disc = b * b - 4 * a * c;
      const dist = [disc + 4, disc - 4, b * b, 4 * a * c].filter((d) => d !== disc).map(String);
      const { options, correctIndex } = makeOptions(String(disc), dist);
      q = {
        id: makeId("algebra", difficulty, i),
        topic: "algebra", difficulty, xpReward: xp, historicalNote: note,
        prompt: `Qual é o discriminante Δ de ${fmtEq(a, b, c)} = 0?`,
        promptLatex: `${fmtEqLatex(a, b, c)} = 0`,
        options, correctIndex,
        explanation: `Δ = b² - 4ac = (${b})² - 4·${a}·${c} = ${b * b} - ${4 * a * c} = ${disc}`,
        explanationLatex: `\\Delta = b^2 - 4ac = (${b})^2 - 4 \\cdot ${a} \\cdot ${c} = ${disc}`,
      };
    } else {
      // Grupo de Galois
      type GalCase = { latex: string; group: string; desc: string; eq: string };
      const cases: GalCase[] = [
        {
          latex: "x^2 - 2 = 0",
          eq: "x² - 2 = 0",
          group: "ℤ/2ℤ",
          desc: "Δ = 8 > 0 — duas raízes reais distintas ±√2.",
        },
        {
          latex: "x^2 + 2x + 1 = 0",
          eq: "x² + 2x + 1 = 0",
          group: "trivial {e}",
          desc: "Δ = 0 — raiz dupla x = -1. Polinômio já está sobre ℚ.",
        },
        {
          latex: "x^2 + 1 = 0",
          eq: "x² + 1 = 0",
          group: "ℤ/2ℤ",
          desc: "Δ = -4 < 0 — raízes complexas ±i. Grupo de Galois permuta os conjugados.",
        },
        {
          latex: "x^2 - 3x + 2 = 0",
          eq: "x² - 3x + 2 = 0",
          group: "ℤ/2ℤ",
          desc: "Δ = 1 > 0 — raízes 1 e 2, ambas racionais. Grupo ℤ/2ℤ permuta as duas.",
        },
      ];
      const chosen = cases[i % cases.length];
      const dist = ["S₃", "A₃", "ℤ/3ℤ", "trivial {e}", "ℤ/2ℤ"].filter((d) => d !== chosen.group);
      const { options, correctIndex } = makeOptions(chosen.group, dist);
      q = {
        id: makeId("algebra", difficulty, i),
        topic: "algebra", difficulty, xpReward: xp, historicalNote: note,
        prompt: `Qual é o grupo de Galois de ${chosen.eq}?`,
        promptLatex: chosen.latex,
        options, correctIndex,
        explanation: chosen.desc,
      };
    }

    qs.push(q);
  }
  return qs;
};

// ─── Geometria ────────────────────────────────────────────────────────────────

const pythagorean = [[3,4,5],[5,12,13],[8,15,17],[7,24,25],[6,8,10],[9,12,15],[20,21,29]];

const genGeometria = (difficulty: Difficulty, count: number): Question[] => {
  const qs: Question[] = [];
  for (let i = 0; i < count; i++) {
    const note = pickNote("geometria", i);
    const xp = xpFor(difficulty);
    let q: Question;

    if (difficulty === "iniciante") {
      const type = rng(0, 1);
      if (type === 0) {
        const w = rng(2, 20), h = rng(2, 20);
        const correct = w * h;
        const dist = [w + h, 2 * (w + h), correct + w, correct - h]
          .filter((d) => d !== correct && d > 0).map(String);
        const { options, correctIndex } = makeOptions(String(correct), dist);
        q = {
          id: makeId("geometria", difficulty, i),
          topic: "geometria", difficulty, xpReward: xp, historicalNote: note,
          prompt: `Qual é a área de um retângulo com base ${w} e altura ${h}?`,
          options, correctIndex,
          explanation: `Área = base × altura = ${w} × ${h} = ${correct}`,
          explanationLatex: `A = b \\times h = ${w} \\times ${h} = ${correct}`,
        };
      } else {
        const b = rng(2, 20), h = rng(2, 20);
        const correct = (b * h) / 2;
        const dist = [b * h, b + h, correct + b, correct - 1]
          .filter((d) => d !== correct && d > 0).map(String);
        const { options, correctIndex } = makeOptions(String(correct), dist);
        q = {
          id: makeId("geometria", difficulty, i),
          topic: "geometria", difficulty, xpReward: xp, historicalNote: note,
          prompt: `Qual é a área de um triângulo com base ${b} e altura ${h}?`,
          options, correctIndex,
          explanation: `Área = (base × altura) / 2 = (${b} × ${h}) / 2 = ${correct}`,
          explanationLatex: `A = \\frac{b \\times h}{2} = \\frac{${b} \\times ${h}}{2} = ${correct}`,
        };
      }
    } else if (difficulty === "intermediario") {
      const triple = pythagorean[i % pythagorean.length];
      const [a, b, c] = triple;
      const type = rng(0, 1);
      if (type === 0) {
        const dist = [c + 1, c - 1, a + b, Math.round(Math.sqrt(a + b))]
          .filter((d) => d !== c && d > 0).map(String);
        const { options, correctIndex } = makeOptions(String(c), dist);
        q = {
          id: makeId("geometria", difficulty, i),
          topic: "geometria", difficulty, xpReward: xp, historicalNote: note,
          prompt: `Em um triângulo retângulo com catetos ${a} e ${b}, qual é a hipotenusa?`,
          promptLatex: `a=${a},\\; b=${b},\\; c = \\sqrt{a^2 + b^2} = ?`,
          options, correctIndex,
          explanation: `c = √(${a}² + ${b}²) = √(${a*a} + ${b*b}) = √${c*c} = ${c}`,
          explanationLatex: `c = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a*a+b*b}} = ${c}`,
        };
      } else {
        const dist = [b + 1, b - 1, c - a, a + b]
          .filter((d) => d !== b && d > 0).map(String);
        const { options, correctIndex } = makeOptions(String(b), dist);
        q = {
          id: makeId("geometria", difficulty, i),
          topic: "geometria", difficulty, xpReward: xp, historicalNote: note,
          prompt: `Em um triângulo retângulo com hipotenusa ${c} e cateto ${a}, qual é o outro cateto?`,
          promptLatex: `c=${c},\\; a=${a},\\; b = \\sqrt{c^2 - a^2} = ?`,
          options, correctIndex,
          explanation: `b = √(${c}² - ${a}²) = √(${c*c} - ${a*a}) = √${b*b} = ${b}`,
          explanationLatex: `b = \\sqrt{${c}^2 - ${a}^2} = \\sqrt{${b*b}} = ${b}`,
        };
      }
    } else {
      // Área círculo ou volume cilindro
      const type = rng(0, 1);
      if (type === 0) {
        const r = rng(1, 10);
        const correct = parseFloat((Math.PI * r * r).toFixed(2));
        const dist = [
          parseFloat((3.14 * r * r + 1).toFixed(2)),
          parseFloat((2 * Math.PI * r).toFixed(2)),
          parseFloat((Math.PI * r).toFixed(2)),
        ].filter((d) => d !== correct).map(String);
        const { options, correctIndex } = makeOptions(String(correct), dist);
        q = {
          id: makeId("geometria", difficulty, i),
          topic: "geometria", difficulty, xpReward: xp, historicalNote: note,
          prompt: `Área de um círculo com raio ${r}? (use π ≈ 3,14, 2 decimais)`,
          promptLatex: `A = \\pi r^2,\\quad r = ${r}`,
          options, correctIndex,
          explanation: `A = π × ${r}² = 3,14159… × ${r*r} ≈ ${correct}`,
          explanationLatex: `A = \\pi \\times ${r}^2 \\approx ${correct}`,
        };
      } else {
        const r = rng(1, 6), h = rng(1, 10);
        const correct = parseFloat((Math.PI * r * r * h).toFixed(2));
        const dist = [
          parseFloat((correct + 10).toFixed(2)),
          parseFloat((Math.PI * r * r).toFixed(2)),
          parseFloat((2 * Math.PI * r * h).toFixed(2)),
        ].filter((d) => d !== correct).map(String);
        const { options, correctIndex } = makeOptions(String(correct), dist);
        q = {
          id: makeId("geometria", difficulty, i),
          topic: "geometria", difficulty, xpReward: xp, historicalNote: note,
          prompt: `Volume de um cilindro com raio ${r} e altura ${h}? (π ≈ 3,14, 2 decimais)`,
          promptLatex: `V = \\pi r^2 h,\\quad r=${r},\\; h=${h}`,
          options, correctIndex,
          explanation: `V = π × ${r}² × ${h} ≈ ${correct}`,
          explanationLatex: `V = \\pi \\times ${r}^2 \\times ${h} \\approx ${correct}`,
        };
      }
    }

    qs.push(q);
  }
  return qs;
};

// ─── Trigonometria ────────────────────────────────────────────────────────────

const exactValues = [
  { angle: 0,  sin: "0",     cos: "1",     tan: "0" },
  { angle: 30, sin: "1/2",   cos: "√3/2",  tan: "√3/3" },
  { angle: 45, sin: "√2/2",  cos: "√2/2",  tan: "1" },
  { angle: 60, sin: "√3/2",  cos: "1/2",   tan: "√3" },
  { angle: 90, sin: "1",     cos: "0",     tan: "indefinido" },
];

const allTrigOpts = ["0","1/2","√2/2","√3/2","1","√3","√3/3","indefinido","2","−1","1/4"];

const sinCosPool: Array<{ sin: string; cos: string }> = [
  { sin: "3/5", cos: "4/5" },
  { sin: "5/13", cos: "12/13" },
  { sin: "4/5", cos: "3/5" },
  { sin: "8/17", cos: "15/17" },
  { sin: "12/13", cos: "5/13" },
];

const genTrigonometria = (difficulty: Difficulty, count: number): Question[] => {
  const qs: Question[] = [];
  for (let i = 0; i < count; i++) {
    const note = pickNote("trigonometria", i);
    const xp = xpFor(difficulty);

    if (difficulty === "iniciante") {
      const entry = exactValues[i % exactValues.length];
      const fns = ["sin", "cos", "tan"] as const;
      const fn = fns[rng(0, 2)];
      const fnLatex = fn === "sin" ? "\\sin" : fn === "cos" ? "\\cos" : "\\tan";
      const correct = entry[fn];
      const dist = allTrigOpts.filter((o) => o !== correct);
      const { options, correctIndex } = makeOptions(correct, dist);
      qs.push({
        id: makeId("trigonometria", difficulty, i),
        topic: "trigonometria", difficulty, xpReward: xp, historicalNote: note,
        prompt: `Qual é o valor exato de ${fn}(${entry.angle}°)?`,
        promptLatex: `${fnLatex}(${entry.angle}^\\circ)`,
        options, correctIndex,
        explanation: `${fn}(${entry.angle}°) = ${correct}`,
        explanationLatex: `${fnLatex}(${entry.angle}^\\circ) = ${correct.replace("√", "\\sqrt{")}${correct.includes("√") ? "}" : ""}`,
      });
    } else if (difficulty === "intermediario") {
      const pair = sinCosPool[i % sinCosPool.length];
      const dist = sinCosPool.map((p) => p.cos).filter((c) => c !== pair.cos);
      const { options, correctIndex } = makeOptions(pair.cos, dist);
      qs.push({
        id: makeId("trigonometria", difficulty, i),
        topic: "trigonometria", difficulty, xpReward: xp, historicalNote: note,
        prompt: `Se sin(θ) = ${pair.sin} e θ está no 1° quadrante, qual é cos(θ)?`,
        promptLatex: `\\sin(\\theta) = ${pair.sin},\\quad 0 < \\theta < 90°`,
        options, correctIndex,
        explanation: `Usando sin²θ + cos²θ = 1: cos(θ) = √(1 - (${pair.sin})²) = ${pair.cos}`,
        explanationLatex: `\\cos^2\\theta = 1 - \\sin^2\\theta \\Rightarrow \\cos\\theta = ${pair.cos}`,
      });
    } else {
      // Identidades
      const identities = [
        {
          q: "Qual identidade trigonométrica é sempre verdadeira?",
          correct: "sin²θ + cos²θ = 1",
          opts: ["sin θ + cos θ = 1", "sin²θ = cos²θ", "tan θ = sin θ + cos θ"],
          exp: "A identidade pitagórica fundamental: sin²θ + cos²θ = 1, válida para todo θ.",
          expLatex: "\\sin^2\\theta + \\cos^2\\theta = 1",
        },
        {
          q: "Como se escreve sin(2θ) pela fórmula do ângulo duplo?",
          correct: "2 sin θ cos θ",
          opts: ["sin²θ - cos²θ", "2 sin²θ", "cos²θ - sin²θ"],
          exp: "Fórmula do ângulo duplo: sin(2θ) = 2 sin θ cos θ.",
          expLatex: "\\sin(2\\theta) = 2\\sin\\theta\\cos\\theta",
        },
        {
          q: "Como se escreve cos(α + β)?",
          correct: "cos α cos β - sin α sin β",
          opts: ["cos α + cos β", "sin α cos β + cos α sin β", "cos α cos β + sin α sin β"],
          exp: "Fórmula da soma de ângulos: cos(α+β) = cos α cos β - sin α sin β.",
          expLatex: "\\cos(\\alpha+\\beta) = \\cos\\alpha\\cos\\beta - \\sin\\alpha\\sin\\beta",
        },
        {
          q: "Qual é a relação entre tan θ, sin θ e cos θ?",
          correct: "tan θ = sin θ / cos θ",
          opts: ["tan θ = cos θ / sin θ", "tan θ = sin θ × cos θ", "tan θ = 1 / sin θ"],
          exp: "Por definição: tan θ = sen θ / cos θ (razão seno pelo cosseno).",
          expLatex: "\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}",
        },
      ];
      const chosen = identities[i % identities.length];
      const { options, correctIndex } = makeOptions(chosen.correct, chosen.opts);
      qs.push({
        id: makeId("trigonometria", difficulty, i),
        topic: "trigonometria", difficulty, xpReward: xp, historicalNote: note,
        prompt: chosen.q,
        options, correctIndex,
        explanation: chosen.exp,
        explanationLatex: chosen.expLatex,
      });
    }
  }
  return qs;
};

// ─── Probabilidade ────────────────────────────────────────────────────────────

const colorNames = ["vermelhas", "azuis", "verdes", "amarelas", "brancas", "pretas"];

const combos: Array<{ n: number; k: number; result: number }> = [
  { n: 5, k: 2, result: 10 }, { n: 6, k: 2, result: 15 }, { n: 4, k: 2, result: 6 },
  { n: 5, k: 3, result: 10 }, { n: 6, k: 3, result: 20 }, { n: 7, k: 2, result: 21 },
  { n: 4, k: 1, result: 4 },  { n: 8, k: 2, result: 28 }, { n: 9, k: 2, result: 36 },
];

const genProbabilidade = (difficulty: Difficulty, count: number): Question[] => {
  const qs: Question[] = [];
  for (let i = 0; i < count; i++) {
    const note = pickNote("probabilidade", i);
    const xp = xpFor(difficulty);

    if (difficulty === "iniciante") {
      const total = rng(5, 20);
      const favorable = rng(1, total - 1);
      const color = colorNames[rng(0, 5)];
      const otherColor = colorNames.filter((c) => c !== color)[rng(0, 4)];
      const rest = total - favorable;
      const g = gcd(favorable, total);
      const rNum = favorable / g, rDen = total / g;
      const correctStr = rDen === 1 ? String(rNum) : `${rNum}/${rDen}`;
      const fracPool = ["1/2","1/3","2/3","1/4","3/4","1/5","2/5","3/5","4/5","1/6","5/6"]
        .filter((f) => f !== correctStr);
      const { options, correctIndex } = makeOptions(correctStr, fracPool);
      qs.push({
        id: makeId("probabilidade", difficulty, i),
        topic: "probabilidade", difficulty, xpReward: xp, historicalNote: note,
        prompt: `Uma urna tem ${favorable} bolas ${color} e ${rest} bolas ${otherColor}. Qual a probabilidade de retirar uma bola ${color}?`,
        options, correctIndex,
        explanation: `P = ${favorable}/${total} = ${rNum}/${rDen}`,
        explanationLatex: `P = \\frac{${favorable}}{${total}} = \\frac{${rNum}}{${rDen}}`,
      });
    } else if (difficulty === "intermediario") {
      const combo = combos[i % combos.length];
      const dist = [combo.result + 1, combo.result - 1, combo.n * combo.k, combo.n + combo.k]
        .filter((d) => d !== combo.result && d > 0).map(String);
      const { options, correctIndex } = makeOptions(String(combo.result), dist);
      qs.push({
        id: makeId("probabilidade", difficulty, i),
        topic: "probabilidade", difficulty, xpReward: xp, historicalNote: note,
        prompt: `Quantas combinações de ${combo.k} elementos existem em um conjunto de ${combo.n}? (C(${combo.n},${combo.k}))`,
        promptLatex: `C(${combo.n},${combo.k}) = \\binom{${combo.n}}{${combo.k}}`,
        options, correctIndex,
        explanation: `C(${combo.n},${combo.k}) = ${combo.n}! / (${combo.k}! × ${combo.n - combo.k}!) = ${combo.result}`,
        explanationLatex: `\\binom{${combo.n}}{${combo.k}} = \\frac{${combo.n}!}{${combo.k}!\\cdot${combo.n-combo.k}!} = ${combo.result}`,
      });
    } else {
      const advanced = [
        {
          q: "Em um grupo de 23 pessoas, qual a probabilidade aproximada de dois fazerem aniversário no mesmo dia?",
          correct: "≈ 50%",
          opts: ["≈ 25%", "≈ 75%", "≈ 6%"],
          exp: "O paradoxo do aniversário: com apenas 23 pessoas já há ~50,7% de chance de dois compartilharem a data.",
        },
        {
          q: "Qual é P(exatamente 2 caras) em 3 lançamentos de moeda honesta?",
          correct: "3/8",
          opts: ["1/4", "1/2", "1/8"],
          exp: "P = C(3,2) × (1/2)² × (1/2)¹ = 3 × 1/8 = 3/8.",
          expLatex: "P = \\binom{3}{2}\\left(\\frac{1}{2}\\right)^3 = \\frac{3}{8}",
        },
        {
          q: "Se P(A) = 0,4 e P(B) = 0,3, com A e B independentes, qual é P(A ∩ B)?",
          correct: "0,12",
          opts: ["0,7", "0,1", "0,58"],
          exp: "Eventos independentes: P(A ∩ B) = P(A) × P(B) = 0,4 × 0,3 = 0,12.",
          expLatex: "P(A \\cap B) = P(A) \\cdot P(B) = 0{,}4 \\times 0{,}3 = 0{,}12",
        },
        {
          q: "Num baralho de 52 cartas, qual a probabilidade de retirar um ás?",
          correct: "1/13",
          opts: ["1/4", "1/52", "4/13"],
          exp: "Há 4 ases em 52 cartas: P = 4/52 = 1/13.",
          expLatex: "P = \\frac{4}{52} = \\frac{1}{13}",
        },
      ];
      const chosen = advanced[i % advanced.length];
      const { options, correctIndex } = makeOptions(chosen.correct, chosen.opts);
      qs.push({
        id: makeId("probabilidade", difficulty, i),
        topic: "probabilidade", difficulty, xpReward: xp, historicalNote: note,
        prompt: chosen.q,
        options, correctIndex,
        explanation: chosen.exp,
        explanationLatex: "expLatex" in chosen ? (chosen as { expLatex: string }).expLatex : undefined,
      });
    }
  }
  return qs;
};

// ─── Main generator ───────────────────────────────────────────────────────────

export const generateQuestions = (
  topic: TopicKey,
  difficulty: Difficulty,
  count: number
): Question[] => {
  let qs: Question[];
  switch (topic) {
    case "aritmetica":    qs = genAritmetica(difficulty, count); break;
    case "algebra":       qs = genAlgebra(difficulty, count); break;
    case "geometria":     qs = genGeometria(difficulty, count); break;
    case "trigonometria": qs = genTrigonometria(difficulty, count); break;
    case "probabilidade": qs = genProbabilidade(difficulty, count); break;
  }

  // Pad to exactly count if generator returned fewer
  while (qs.length < count) {
    const base = qs[qs.length % Math.max(qs.length, 1)];
    qs.push({ ...base, id: `${base.id}_r${qs.length}` });
  }

  return qs.slice(0, count);
};
