import type { Difficulty, Question, TopicKey } from "./academiaTypes";
import { XP_BY_DIFFICULTY } from "./academiaTypes";

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const uid = (topic: TopicKey, n: number) => `${topic}_${Date.now().toString(36)}_${n}_${Math.random().toString(36).slice(2, 6)}`;

const buildOptions = (correct: string, distractors: string[]): { options: string[]; correctIndex: number } => {
  const seen = new Set<string>([correct]);
  const filtered = distractors.filter((d) => {
    if (seen.has(d)) return false;
    seen.add(d);
    return true;
  });
  while (filtered.length < 3) filtered.push((Math.random() * 100).toFixed(0));
  const all = shuffle([correct, ...filtered.slice(0, 3)]);
  return { options: all, correctIndex: all.indexOf(correct) };
};

const NOTES: Record<TopicKey, string[]> = {
  aritmetica: [
    "Brahmagupta (628 d.C.) foi o primeiro matemático a formalizar regras para o zero e números negativos.",
    "Euclides provou que existem infinitos números primos por volta de 300 a.C., em Os Elementos.",
    "Fibonacci introduziu os algarismos indo-arábicos na Europa em 1202 com o Liber Abaci.",
    "O algoritmo de Euclides para o MDC, com mais de 2300 anos, ainda é usado em criptografia moderna.",
  ],
  algebra: [
    "A palavra 'álgebra' vem do árabe al-jabr, do tratado de Al-Khwārizmī de 830 d.C.",
    "Bhaskara II, matemático indiano do século XII, popularizou a fórmula quadrática que usamos até hoje.",
    "Évariste Galois morreu aos 20 anos em um duelo, mas não antes de criar a teoria que leva seu nome.",
    "Cardano publicou a solução das cúbicas em 1545, abrindo caminho para os números complexos.",
  ],
  geometria: [
    "Pitágoras não foi o primeiro a descobrir seu teorema — os babilônios já o usavam 1000 anos antes.",
    "O número π foi calculado por Arquimedes com polígonos de 96 lados por volta de 250 a.C.",
    "Euclides organizou toda a geometria conhecida em 13 livros chamados Os Elementos.",
    "Eratóstenes mediu a circunferência da Terra em 240 a.C. com erro de apenas 2%.",
  ],
  trigonometria: [
    "Leonhard Euler introduziu a notação sin, cos e a função f(x) no século XVIII.",
    "Hiparco de Niceia (190 a.C.) é considerado o pai da trigonometria.",
    "A identidade sen²θ + cos²θ = 1 é o Teorema de Pitágoras aplicado ao círculo unitário.",
    "Al-Battani, no século IX, introduziu o seno como conhecemos hoje, substituindo a corda dos gregos.",
  ],
  probabilidade: [
    "A teoria da probabilidade nasceu em 1654 numa troca de cartas entre Pascal e Fermat sobre jogos de azar.",
    "Jacob Bernoulli demonstrou a Lei dos Grandes Números em 1713, base da estatística moderna.",
    "Laplace afirmou: 'A probabilidade é o bom-senso reduzido a cálculo'.",
    "Kolmogorov axiomatizou a probabilidade em 1933, dando-lhe rigor matemático definitivo.",
  ],
};

const noteFor = (topic: TopicKey) => pick(NOTES[topic]);

// ============================== ARITMÉTICA ==============================
const genArithmetic = (difficulty: Difficulty): Omit<Question, "id" | "topic" | "difficulty" | "xpReward"> => {
  if (difficulty === "iniciante") {
    const a = rand(1, 50);
    const b = rand(1, 50);
    const op = pick(["+", "-"]);
    const correct = op === "+" ? a + b : a - b;
    const { options, correctIndex } = buildOptions(String(correct), [
      String(correct + 1),
      String(correct - 1),
      String(correct + rand(2, 5)),
    ]);
    return {
      prompt: `Quanto é ${a} ${op} ${b}?`,
      options,
      correctIndex,
      explanation: `${a} ${op} ${b} = ${correct}.`,
      historicalNote: noteFor("aritmetica"),
    };
  }
  if (difficulty === "intermediario") {
    const denoms = [2, 3, 4, 5, 6];
    const b = pick(denoms);
    const d = pick(denoms.filter((x) => x !== b));
    const a = rand(1, b - 1);
    const c = rand(1, d - 1);
    const num = a * d + c * b;
    const den = b * d;
    const correct = `${num}/${den}`;
    const { options, correctIndex } = buildOptions(correct, [
      `${num + 1}/${den}`,
      `${num}/${den + 1}`,
      `${a + c}/${b + d}`,
    ]);
    return {
      prompt: `Quanto é ${a}/${b} + ${c}/${d}?`,
      promptLatex: `\\frac{${a}}{${b}} + \\frac{${c}}{${d}} = \\,?`,
      options,
      correctIndex,
      explanation: `MMC dos denominadores: ${b}·${d} = ${den}. Resultado: ${num}/${den}.`,
      historicalNote: noteFor("aritmetica"),
    };
  }
  // avançado: potências e raízes
  const variant = pick(["pow", "sqrt", "mdc"]);
  if (variant === "pow") {
    const base = rand(2, 7);
    const exp = rand(2, 4);
    const correct = Math.pow(base, exp);
    const { options, correctIndex } = buildOptions(String(correct), [
      String(correct + base),
      String(Math.pow(base, exp - 1)),
      String(base * exp),
    ]);
    return {
      prompt: `Calcule ${base}^${exp}.`,
      promptLatex: `${base}^{${exp}} = \\,?`,
      options,
      correctIndex,
      explanation: `${base}^${exp} = ${correct}.`,
      historicalNote: noteFor("aritmetica"),
    };
  }
  if (variant === "sqrt") {
    const root = rand(2, 15);
    const sq = root * root;
    const { options, correctIndex } = buildOptions(String(root), [
      String(root + 1),
      String(root - 1),
      String(Math.round(sq / 2)),
    ]);
    return {
      prompt: `Qual é a raiz quadrada de ${sq}?`,
      promptLatex: `\\sqrt{${sq}} = \\,?`,
      options,
      correctIndex,
      explanation: `${root} × ${root} = ${sq}.`,
      historicalNote: noteFor("aritmetica"),
    };
  }
  // mdc
  const x = rand(8, 60);
  const y = rand(8, 60);
  const gcd = (m: number, n: number): number => (n === 0 ? m : gcd(n, m % n));
  const correct = gcd(x, y);
  const { options, correctIndex } = buildOptions(String(correct), [
    String(correct + 1),
    String(Math.max(1, correct - 1)),
    String(correct * 2),
  ]);
  return {
    prompt: `Qual é o MDC de ${x} e ${y}?`,
    options,
    correctIndex,
    explanation: `Pelo algoritmo de Euclides, MDC(${x}, ${y}) = ${correct}.`,
    historicalNote: noteFor("aritmetica"),
  };
};

// ============================== ÁLGEBRA ==============================
const genAlgebra = (difficulty: Difficulty): Omit<Question, "id" | "topic" | "difficulty" | "xpReward"> => {
  if (difficulty === "iniciante") {
    const a = rand(1, 9);
    const x = rand(-10, 10);
    const b = rand(-20, 20);
    const c = a * x + b;
    const { options, correctIndex } = buildOptions(String(x), [
      String(x + 1),
      String(x - 1),
      String(-x),
    ]);
    return {
      prompt: `Resolva: ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c}`,
      promptLatex: `${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c}`,
      options,
      correctIndex,
      explanation: `Isolando x: x = (${c} - ${b}) / ${a} = ${x}.`,
      historicalNote: noteFor("algebra"),
    };
  }
  if (difficulty === "intermediario") {
    // sistema 2x2 simples
    const x = rand(-5, 5);
    const y = rand(-5, 5);
    const a = rand(1, 4);
    const b = rand(1, 4);
    const c = a * x + b * y;
    const d = rand(1, 4);
    const e = rand(1, 4);
    const f = d * x + e * y;
    const correct = `(${x}, ${y})`;
    const { options, correctIndex } = buildOptions(correct, [
      `(${y}, ${x})`,
      `(${x + 1}, ${y})`,
      `(${x}, ${y - 1})`,
    ]);
    return {
      prompt: `Resolva o sistema: ${a}x + ${b}y = ${c} e ${d}x + ${e}y = ${f}`,
      promptLatex: `\\begin{cases} ${a}x + ${b}y = ${c} \\\\ ${d}x + ${e}y = ${f} \\end{cases}`,
      options,
      correctIndex,
      explanation: `Solução única: x = ${x}, y = ${y}.`,
      historicalNote: noteFor("algebra"),
    };
  }
  // avançado: discriminante
  const a = rand(1, 4);
  const b = rand(-8, 8);
  const c = rand(-6, 6);
  const disc = b * b - 4 * a * c;
  const { options, correctIndex } = buildOptions(String(disc), [
    String(disc + 1),
    String(b * b + 4 * a * c),
    String(disc - 4),
  ]);
  return {
    prompt: `Qual é o discriminante de ${a}x² ${b >= 0 ? "+" : "-"} ${Math.abs(b)}x ${c >= 0 ? "+" : "-"} ${Math.abs(c)} = 0?`,
    promptLatex: `\\Delta = b^2 - 4ac \\quad \\text{para} \\quad ${a}x^2 ${b >= 0 ? "+" : "-"} ${Math.abs(b)}x ${c >= 0 ? "+" : "-"} ${Math.abs(c)} = 0`,
    options,
    correctIndex,
    explanation: `Δ = ${b}² - 4·${a}·${c} = ${b * b} - ${4 * a * c} = ${disc}.`,
    historicalNote: noteFor("algebra"),
  };
};

// ============================== GEOMETRIA ==============================
const genGeometry = (difficulty: Difficulty): Omit<Question, "id" | "topic" | "difficulty" | "xpReward"> => {
  if (difficulty === "iniciante") {
    const variant = pick(["rect", "tri"]);
    if (variant === "rect") {
      const w = rand(3, 20);
      const h = rand(3, 20);
      const correct = w * h;
      const { options, correctIndex } = buildOptions(String(correct), [
        String(2 * (w + h)),
        String(correct + w),
        String(correct - h),
      ]);
      return {
        prompt: `Qual é a área de um retângulo de ${w} × ${h}?`,
        options,
        correctIndex,
        explanation: `Área = base × altura = ${w} × ${h} = ${correct}.`,
        historicalNote: noteFor("geometria"),
      };
    }
    const base = rand(4, 20);
    const h = rand(3, 15);
    const correct = (base * h) / 2;
    const { options, correctIndex } = buildOptions(String(correct), [
      String(base * h),
      String(correct + 2),
      String(base + h),
    ]);
    return {
      prompt: `Qual é a área de um triângulo de base ${base} e altura ${h}?`,
      promptLatex: `A = \\frac{base \\cdot altura}{2}`,
      options,
      correctIndex,
      explanation: `A = (${base} × ${h}) / 2 = ${correct}.`,
      historicalNote: noteFor("geometria"),
    };
  }
  if (difficulty === "intermediario") {
    const triples: [number, number, number][] = [
      [3, 4, 5],
      [5, 12, 13],
      [8, 15, 17],
      [7, 24, 25],
    ];
    const [a, b, c] = pick(triples);
    const { options, correctIndex } = buildOptions(String(c), [
      String(c + 1),
      String(c - 1),
      String(a + b),
    ]);
    return {
      prompt: `Num triângulo retângulo com catetos ${a} e ${b}, qual é a hipotenusa?`,
      promptLatex: `c = \\sqrt{${a}^2 + ${b}^2}`,
      options,
      correctIndex,
      explanation: `c² = ${a}² + ${b}² = ${a * a + b * b}, então c = ${c}.`,
      historicalNote: noteFor("geometria"),
    };
  }
  // avançado: área de círculo
  const r = rand(2, 12);
  const correct = parseFloat((Math.PI * r * r).toFixed(2));
  const { options, correctIndex } = buildOptions(correct.toString(), [
    (2 * Math.PI * r).toFixed(2),
    (Math.PI * r).toFixed(2),
    (r * r).toFixed(2),
  ]);
  return {
    prompt: `Qual é a área de um círculo de raio ${r}? (use π ≈ 3.14159)`,
    promptLatex: `A = \\pi r^2`,
    options,
    correctIndex,
    explanation: `A = π · ${r}² = π · ${r * r} ≈ ${correct}.`,
    historicalNote: noteFor("geometria"),
  };
};

// ============================== TRIGONOMETRIA ==============================
const TRIG_TABLE: { angle: string; deg: number; sin: string; cos: string; tan: string }[] = [
  { angle: "0°", deg: 0, sin: "0", cos: "1", tan: "0" },
  { angle: "30°", deg: 30, sin: "1/2", cos: "√3/2", tan: "√3/3" },
  { angle: "45°", deg: 45, sin: "√2/2", cos: "√2/2", tan: "1" },
  { angle: "60°", deg: 60, sin: "√3/2", cos: "1/2", tan: "√3" },
  { angle: "90°", deg: 90, sin: "1", cos: "0", tan: "indef." },
];

const genTrig = (difficulty: Difficulty): Omit<Question, "id" | "topic" | "difficulty" | "xpReward"> => {
  if (difficulty === "iniciante") {
    const entry = pick(TRIG_TABLE);
    const fn = pick(["sin", "cos", "tan"] as const);
    const correct = entry[fn];
    const others = TRIG_TABLE.filter((e) => e !== entry).map((e) => e[fn]);
    const { options, correctIndex } = buildOptions(correct, shuffle(others).slice(0, 3));
    return {
      prompt: `Qual o valor de ${fn}(${entry.angle})?`,
      promptLatex: `\\${fn}(${entry.deg}°) = \\,?`,
      options,
      correctIndex,
      explanation: `${fn}(${entry.angle}) = ${correct} (valor exato da tabela trigonométrica).`,
      historicalNote: noteFor("trigonometria"),
    };
  }
  if (difficulty === "intermediario") {
    // lei dos cossenos: a²=b²+c²-2bc·cos(A)
    const b = rand(4, 10);
    const c = rand(4, 10);
    const angle = pick([60, 90, 120]);
    const cosA = angle === 60 ? 0.5 : angle === 90 ? 0 : -0.5;
    const a2 = b * b + c * c - 2 * b * c * cosA;
    const a = parseFloat(Math.sqrt(a2).toFixed(2));
    const { options, correctIndex } = buildOptions(a.toString(), [
      (a + 1).toFixed(2),
      (a - 1).toFixed(2),
      Math.sqrt(b * b + c * c).toFixed(2),
    ]);
    return {
      prompt: `Lei dos cossenos: lados b = ${b}, c = ${c}, ângulo A = ${angle}°. Qual o lado a?`,
      promptLatex: `a^2 = ${b}^2 + ${c}^2 - 2 \\cdot ${b} \\cdot ${c} \\cdot \\cos(${angle}°)`,
      options,
      correctIndex,
      explanation: `a² = ${b * b} + ${c * c} - ${2 * b * c}·${cosA} = ${a2}, logo a ≈ ${a}.`,
      historicalNote: noteFor("trigonometria"),
    };
  }
  // avançado: identidade
  const correct = "1";
  const { options, correctIndex } = buildOptions(correct, ["0", "2", "sen(2θ)"]);
  return {
    prompt: "Qual é o valor de sen²(θ) + cos²(θ)?",
    promptLatex: `\\sin^2(\\theta) + \\cos^2(\\theta) = \\,?`,
    options,
    correctIndex,
    explanation: "Identidade pitagórica fundamental: sen²θ + cos²θ = 1 para todo θ.",
    historicalNote: noteFor("trigonometria"),
  };
};

// ============================== PROBABILIDADE ==============================
const genProbability = (difficulty: Difficulty): Omit<Question, "id" | "topic" | "difficulty" | "xpReward"> => {
  if (difficulty === "iniciante") {
    const red = rand(2, 8);
    const blue = rand(2, 8);
    const total = red + blue;
    const correct = `${red}/${total}`;
    const { options, correctIndex } = buildOptions(correct, [
      `${blue}/${total}`,
      `${red}/${blue}`,
      `${total}/${red}`,
    ]);
    return {
      prompt: `Uma urna tem ${red} bolas vermelhas e ${blue} azuis. Qual a probabilidade de tirar uma vermelha?`,
      promptLatex: `P(\\text{vermelha}) = \\frac{\\text{vermelhas}}{\\text{total}}`,
      options,
      correctIndex,
      explanation: `P = casos favoráveis / total = ${red}/${total}.`,
      historicalNote: noteFor("probabilidade"),
    };
  }
  if (difficulty === "intermediario") {
    // P(A∩B) = P(A)·P(B) eventos independentes
    const a = rand(2, 5);
    const b = rand(2, 5);
    const c = rand(2, 5);
    const d = rand(2, 5);
    const correct = `${a * c}/${b * d}`;
    const { options, correctIndex } = buildOptions(correct, [
      `${a + c}/${b + d}`,
      `${a * c}/${b + d}`,
      `${a}/${b * d}`,
    ]);
    return {
      prompt: `Eventos independentes: P(A) = ${a}/${b}, P(B) = ${c}/${d}. Quanto vale P(A∩B)?`,
      promptLatex: `P(A \\cap B) = P(A) \\cdot P(B)`,
      options,
      correctIndex,
      explanation: `P(A∩B) = (${a}/${b}) · (${c}/${d}) = ${a * c}/${b * d}.`,
      historicalNote: noteFor("probabilidade"),
    };
  }
  // avançado: combinação
  const n = rand(5, 9);
  const k = rand(2, Math.min(4, n - 1));
  const fact = (m: number): number => (m <= 1 ? 1 : m * fact(m - 1));
  const correct = fact(n) / (fact(k) * fact(n - k));
  const { options, correctIndex } = buildOptions(String(correct), [
    String(correct + n),
    String(fact(n) / fact(k)),
    String(n * k),
  ]);
  return {
    prompt: `Quanto vale C(${n}, ${k})?`,
    promptLatex: `C(${n}, ${k}) = \\frac{${n}!}{${k}! \\cdot (${n}-${k})!}`,
    options,
    correctIndex,
    explanation: `C(${n}, ${k}) = ${n}! / (${k}! · ${n - k}!) = ${correct}.`,
    historicalNote: noteFor("probabilidade"),
  };
};

const GENERATORS: Record<TopicKey, (d: Difficulty) => Omit<Question, "id" | "topic" | "difficulty" | "xpReward">> = {
  aritmetica: genArithmetic,
  algebra: genAlgebra,
  geometria: genGeometry,
  trigonometria: genTrig,
  probabilidade: genProbability,
};

export const generateQuestions = (
  topic: TopicKey,
  difficulty: Difficulty,
  count: number,
): Question[] => {
  const xpReward = XP_BY_DIFFICULTY[difficulty];
  const out: Question[] = [];
  const seenPrompts = new Set<string>();
  let attempts = 0;
  while (out.length < count && attempts < count * 6) {
    attempts++;
    const base = GENERATORS[topic](difficulty);
    if (seenPrompts.has(base.prompt)) continue;
    seenPrompts.add(base.prompt);
    out.push({
      ...base,
      id: uid(topic, out.length),
      topic,
      difficulty,
      xpReward,
    });
  }
  // garantir exatamente `count` repetindo se preciso
  let r = 0;
  while (out.length < count) {
    const src = out[r % out.length];
    out.push({ ...src, id: `${src.id}_r${r}` });
    r++;
  }
  return out;
};
