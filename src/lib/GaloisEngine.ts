export interface SolutionStep {
  title: string;
  latex: string;
  description: string;
}

export interface Solution {
  roots: { real: number; imag: number }[];
  steps: SolutionStep[];
  groupInfo: string;
}

function formatNum(n: number): string {
  return Math.abs(n) < 1e-10 ? "0" : parseFloat(n.toFixed(6)).toString();
}

function rootStr(r: { real: number; imag: number }): string {
  if (Math.abs(r.imag) < 1e-10) return formatNum(r.real);
  const sign = r.imag > 0 ? "+" : "-";
  if (Math.abs(r.real) < 1e-10) return `${formatNum(Math.abs(r.imag))}i`;
  return `${formatNum(r.real)} ${sign} ${formatNum(Math.abs(r.imag))}i`;
}

export function solveLinear(a: number, b: number): Solution {
  if (a === 0) {
    return {
      roots: [],
      steps: [{ title: "Erro", latex: "a = 0", description: "Coeficiente 'a' não pode ser zero." }],
      groupInfo: "Indefinido",
    };
  }
  const x = -b / a;
  return {
    roots: [{ real: x, imag: 0 }],
    steps: [
      { title: "Equação", latex: `${a}x + ${b} = 0`, description: "Equação linear dada." },
      { title: "Isolando x", latex: `x = -\\frac{b}{a} = -\\frac{${b}}{${a}}`, description: "Dividimos ambos os lados por a." },
      { title: "Resultado", latex: `x = ${formatNum(x)}`, description: "A raiz da equação." },
    ],
    groupInfo: "Grupo trivial {e} — a equação linear possui simetria trivial sob a teoria de Galois.",
  };
}

export function solveQuadratic(a: number, b: number, c: number): Solution {
  if (a === 0) return solveLinear(b, c);

  const disc = b * b - 4 * a * c;
  const steps: SolutionStep[] = [
    { title: "Equação", latex: `${a}x^2 + ${b}x + ${c} = 0`, description: "Equação quadrática dada." },
    { title: "Discriminante", latex: `\\Delta = b^2 - 4ac = ${b}^2 - 4 \\cdot ${a} \\cdot ${c} = ${formatNum(disc)}`, description: "Calculamos o discriminante para determinar a natureza das raízes." },
  ];

  let roots: { real: number; imag: number }[];

  if (disc >= 0) {
    const sqrtDisc = Math.sqrt(disc);
    const x1 = (-b + sqrtDisc) / (2 * a);
    const x2 = (-b - sqrtDisc) / (2 * a);
    roots = [{ real: x1, imag: 0 }, { real: x2, imag: 0 }];
    steps.push({
      title: "Fórmula de Bhaskara",
      latex: `x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a} = \\frac{${-b} \\pm ${formatNum(sqrtDisc)}}{${2 * a}}`,
      description: "Aplicamos a fórmula quadrática (resolução por radicais).",
    });
    steps.push({
      title: "Raízes",
      latex: `x_1 = ${formatNum(x1)}, \\quad x_2 = ${formatNum(x2)}`,
      description: disc === 0 ? "Raiz dupla (discriminante zero)." : "Duas raízes reais distintas.",
    });
  } else {
    const realPart = -b / (2 * a);
    const imagPart = Math.sqrt(-disc) / (2 * a);
    roots = [
      { real: realPart, imag: imagPart },
      { real: realPart, imag: -imagPart },
    ];
    steps.push({
      title: "Raízes Complexas",
      latex: `x = ${formatNum(realPart)} \\pm ${formatNum(imagPart)}i`,
      description: "Discriminante negativo — raízes complexas conjugadas.",
    });
  }

  steps.push({
    title: "Grupo de Galois",
    latex: disc >= 0 ? "\\text{Gal} \\cong \\mathbb{Z}/2\\mathbb{Z}" : "\\text{Gal} \\cong S_2",
    description: "O grupo de Galois da equação quadrática é isomorfo a ℤ/2ℤ (grupo cíclico de ordem 2), refletindo a permutação das duas raízes.",
  });

  return { roots, steps, groupInfo: "ℤ/2ℤ — Grupo cíclico de ordem 2 (simetria de permutação das raízes)." };
}

export function solveCubic(a: number, b: number, c: number, d: number): Solution {
  if (a === 0) return solveQuadratic(b, c, d);

  const p0 = b / a, p1 = c / a, p2 = d / a;
  const p = p1 - (p0 * p0) / 3;
  const q = p2 - (p0 * p1) / 3 + (2 * p0 * p0 * p0) / 27;

  const steps: SolutionStep[] = [
    { title: "Equação", latex: `${a}x^3 + ${b}x^2 + ${c}x + ${d} = 0`, description: "Equação cúbica dada." },
    { title: "Forma Reduzida (Cardano)", latex: `t^3 + ${formatNum(p)}t + ${formatNum(q)} = 0`, description: `Substituição de Cardano: x = t - \\frac{b}{3a} = t - ${formatNum(p0 / 3)}. Eliminamos o termo quadrático.` },
  ];

  const disc = -4 * p * p * p - 27 * q * q;
  steps.push({
    title: "Discriminante",
    latex: `\\Delta = -4p^3 - 27q^2 = ${formatNum(disc)}`,
    description: disc > 0 ? "Três raízes reais distintas (casus irreducibilis)." : disc === 0 ? "Raiz múltipla." : "Uma raiz real e duas complexas conjugadas.",
  });

  const roots: { real: number; imag: number }[] = [];
  const D = (q * q) / 4 + (p * p * p) / 27;

  if (D >= 0) {
    const sqrtD = Math.sqrt(D);
    const u = Math.cbrt(-q / 2 + sqrtD);
    const v = Math.cbrt(-q / 2 - sqrtD);
    const t1 = u + v;
    roots.push({ real: t1 - p0 / 3, imag: 0 });

    const realPart = -(u + v) / 2 - p0 / 3;
    const imagPart = (Math.sqrt(3) / 2) * (u - v);

    if (Math.abs(imagPart) < 1e-10) {
      roots.push({ real: realPart, imag: 0 });
      roots.push({ real: realPart, imag: 0 });
    } else {
      roots.push({ real: realPart, imag: imagPart });
      roots.push({ real: realPart, imag: -imagPart });
    }

    steps.push({
      title: "Fórmula de Cardano-Tartaglia",
      latex: `u = \\sqrt[3]{-\\frac{q}{2} + \\sqrt{D}}, \\quad v = \\sqrt[3]{-\\frac{q}{2} - \\sqrt{D}}`,
      description: "Decompomos usando a substituição u + v = t de Cardano.",
    });
  } else {
    const r = Math.sqrt((-p * p * p) / 27);
    const theta = Math.acos(-q / (2 * r));
    const m = 2 * Math.cbrt(r);
    for (let k = 0; k < 3; k++) {
      roots.push({ real: m * Math.cos((theta + 2 * Math.PI * k) / 3) - p0 / 3, imag: 0 });
    }
    steps.push({
      title: "Solução Trigonométrica",
      latex: `x_k = 2\\sqrt[3]{r} \\cos\\left(\\frac{\\theta + 2\\pi k}{3}\\right) - \\frac{b}{3a}`,
      description: "No casus irreducibilis (Δ > 0), usamos a forma trigonométrica para obter três raízes reais.",
    });
  }

  steps.push({
    title: "Raízes",
    latex: roots.map((r, i) => `x_{${i + 1}} = ${rootStr(r)}`).join(", \\quad "),
    description: "As raízes encontradas pela fórmula de Cardano-Tartaglia.",
  });

  const isS3 = disc !== 0;
  steps.push({
    title: "Grupo de Galois",
    latex: isS3 ? "\\text{Gal} \\cong S_3" : "\\text{Gal} \\subseteq A_3 \\cong \\mathbb{Z}/3\\mathbb{Z}",
    description: isS3
      ? "O grupo de Galois é S₃ (grupo simétrico de 3 elementos, ordem 6). A resolução por radicais é possível pois S₃ é solúvel: S₃ ⊃ A₃ ⊃ {e}."
      : "Discriminante zero implica simetrias reduzidas — subgrupo de S₃.",
  });

  return {
    roots,
    steps,
    groupInfo: isS3
      ? "S₃ — Grupo simétrico de ordem 6. Cadeia de resolução: S₃ ⊃ A₃ ⊃ {e}. Solúvel, logo resolúvel por radicais (Galois)."
      : "A₃ ≅ ℤ/3ℤ — Grupo alternado/cíclico de ordem 3.",
  };
}
