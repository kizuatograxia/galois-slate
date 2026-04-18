export interface Question {
  id: string;
  text: string;
  discipline: "matematica" | "fisica" | "quimica";
  origin: "ENEM" | "Concurso";
  difficulty: "facil" | "medio" | "dificil";
}

export interface QuestionSolution {
  summary: string;
  steps: string[];
  finalAnswer: string;
}

// Mock database of questions (ENEM-style)
const mockQuestions: Question[] = [
  {
    id: "q1",
    text: "Uma função quadrática f(x) = ax² + bx + c tem raízes em x = 2 e x = -3, e passa pelo ponto (0, 6). Qual o valor do coeficiente a?",
    discipline: "matematica",
    origin: "ENEM",
    difficulty: "medio",
  },
  {
    id: "q2",
    text: "Um corpo de massa 5 kg é lançado verticalmente para cima com velocidade inicial de 20 m/s. Considerando g = 10 m/s², qual a altura máxima atingida?",
    discipline: "fisica",
    origin: "ENEM",
    difficulty: "medio",
  },
  {
    id: "q3",
    text: "Calcule o pH de uma solução de HCl 0,001 M, sabendo que o HCl é um ácido forte que se dissocia completamente em água.",
    discipline: "quimica",
    origin: "ENEM",
    difficulty: "facil",
  },
  {
    id: "q4",
    text: "Determine o valor de x na equação log₂(x + 3) + log₂(x - 1) = 3.",
    discipline: "matematica",
    origin: "Concurso",
    difficulty: "medio",
  },
  {
    id: "q5",
    text: "Um projétil é lançado horizontalmente do alto de um penhasco de 80 m de altura com velocidade de 30 m/s. Quanto tempo leva para atingir o solo? (Considere g = 10 m/s²)",
    discipline: "fisica",
    origin: "Concurso",
    difficulty: "medio",
  },
  {
    id: "q6",
    text: "Qual a massa de NaOH (massa molar = 40 g/mol) necessária para preparar 500 mL de uma solução 0,5 M?",
    discipline: "quimica",
    origin: "ENEM",
    difficulty: "facil",
  },
  {
    id: "q7",
    text: "Em um triângulo retângulo, um dos catetos mede 12 cm e a hipotenusa mede 13 cm. Qual o valor do outro cateto?",
    discipline: "matematica",
    origin: "ENEM",
    difficulty: "facil",
  },
];

// Mock solutions database
const mockSolutions: Record<string, QuestionSolution> = {
  q1: {
    summary: "Questão de função quadrática envolvendo raízes e um ponto conhecido. Precisamos usar a forma fatorada e o ponto dado para encontrar o coeficiente a.",
    steps: [
      "Como as raízes são x = 2 e x = -3, podemos escrever: f(x) = a(x - 2)(x + 3)",
      "Expandindo: f(x) = a(x² + 3x - 2x - 6) = a(x² + x - 6)",
      "Usando o ponto (0, 6): f(0) = 6, então a(0² + 0 - 6) = 6",
      "Simplificando: -6a = 6",
      "Resolvendo: a = -1",
    ],
    finalAnswer: "a = -1",
  },
  q2: {
    summary: "Problema de lançamento vertical usando as equações do movimento uniformemente variado. A altura máxima ocorre quando a velocidade se anula.",
    steps: [
      "Usar a equação de Torricelli: v² = v₀² - 2gh (sinal negativo pois a gravidade é oposta ao movimento)",
      "Na altura máxima, v = 0, então: 0 = v₀² - 2gh",
      "Reorganizando: h = v₀²/(2g)",
      "Substituindo valores: h = (20)²/(2×10)",
      "Calculando: h = 400/20 = 20 m",
    ],
    finalAnswer: "Altura máxima = 20 metros",
  },
  q3: {
    summary: "Cálculo de pH de solução de ácido forte. Como o HCl se dissocia completamente, [H⁺] = [HCl].",
    steps: [
      "HCl é um ácido forte, logo [H⁺] = [HCl] = 0,001 M",
      "Converter para notação científica: [H⁺] = 1×10⁻³ M",
      "Aplicar a definição de pH: pH = -log[H⁺]",
      "Calcular: pH = -log(10⁻³)",
      "Simplificar: pH = 3",
    ],
    finalAnswer: "pH = 3",
  },
  q4: {
    summary: "Equação logarítmica que requer a propriedade da soma de logaritmos e conversão para forma exponencial.",
    steps: [
      "Usar a propriedade log a + log b = log(ab): log₂[(x+3)(x-1)] = 3",
      "Converter para forma exponencial: (x+3)(x-1) = 2³ = 8",
      "Expandir: x² - x + 3x - 3 = 8",
      "Simplificar: x² + 2x - 3 = 8, então x² + 2x - 11 = 0",
      "Aplicar Bhaskara: x = (-2 ± √(4+44))/2 = (-2 ± √48)/2 = (-2 ± 4√3)/2",
      "Soluções: x = -1 + 2√3 ≈ 2,46 ou x = -1 - 2√3 ≈ -4,46",
      "Verificar domínio: x + 3 > 0 e x - 1 > 0, logo x > 1",
      "Apenas x = -1 + 2√3 é válida",
    ],
    finalAnswer: "x = -1 + 2√3 ≈ 2,46",
  },
  q5: {
    summary: "Lançamento horizontal: o movimento vertical é queda livre independente do movimento horizontal.",
    steps: [
      "O tempo de queda depende apenas da altura e da gravidade",
      "Usar a equação: h = ½gt²",
      "Reorganizar: t² = 2h/g",
      "Substituir valores: t² = (2×80)/10 = 160/10 = 16",
      "Calcular: t = √16 = 4 s",
    ],
    finalAnswer: "Tempo = 4 segundos",
  },
  q6: {
    summary: "Cálculo estequiométrico usando molaridade. Precisamos relacionar massa, volume e concentração.",
    steps: [
      "Fórmula da molaridade: M = n/V, onde n é número de mols e V é volume em litros",
      "Converter volume: 500 mL = 0,5 L",
      "Calcular número de mols: n = M × V = 0,5 × 0,5 = 0,25 mol",
      "Calcular massa: m = n × MM = 0,25 × 40 = 10 g",
    ],
    finalAnswer: "Massa necessária = 10 gramas de NaOH",
  },
  q7: {
    summary: "Aplicação direta do Teorema de Pitágoras em um triângulo retângulo.",
    steps: [
      "Teorema de Pitágoras: a² + b² = c², onde c é a hipotenusa",
      "Dados: um cateto a = 12 cm, hipotenusa c = 13 cm",
      "Substituir: 12² + b² = 13²",
      "Calcular: 144 + b² = 169",
      "Isolar b²: b² = 169 - 144 = 25",
      "Extrair raiz: b = √25 = 5 cm",
    ],
    finalAnswer: "O outro cateto mede 5 cm",
  },
};

class QuestionsService {
  /**
   * Get all available questions
   */
  getQuestions(): Question[] {
    return mockQuestions;
  }

  /**
   * Get questions filtered by discipline and/or origin
   */
  getFilteredQuestions(
    discipline?: Question["discipline"],
    origin?: Question["origin"]
  ): Question[] {
    return mockQuestions.filter((q) => {
      const matchesDiscipline = !discipline || q.discipline === discipline;
      const matchesOrigin = !origin || q.origin === origin;
      return matchesDiscipline && matchesOrigin;
    });
  }

  /**
   * Solve a question by ID
   * In the future, this could call an external API
   */
  async solveQuestion(questionId: string): Promise<QuestionSolution> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const solution = mockSolutions[questionId];
    if (!solution) {
      throw new Error("Solution not found for this question");
    }

    return solution;
  }

  /**
   * Solve a custom question provided by the user
   * For now, returns a generic response. In the future, could integrate with AI API
   */
  async solveCustomQuestion(questionText: string): Promise<QuestionSolution> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generic response for custom questions (fallback)
    return {
      summary:
        "Esta é uma questão personalizada. No momento, não temos uma solução específica disponível.",
      steps: [
        "Identifique os dados fornecidos no problema",
        "Determine qual conceito ou fórmula aplicar",
        "Organize as informações de forma clara",
        "Execute os cálculos necessários passo a passo",
        "Verifique se a resposta faz sentido no contexto do problema",
      ],
      finalAnswer:
        "Para questões personalizadas, recomendamos consultar material de apoio específico ou um professor.",
    };
  }

  /**
   * Future: integrate with external API
   * This method is prepared for when we have a real API endpoint
   */
  private async callExternalAPI(question: string): Promise<QuestionSolution> {
    // TODO: Implement real API integration
    // Example: const response = await fetch('https://api.example.com/solve', { ... });
    throw new Error("External API not yet implemented");
  }
}

// Export singleton instance
export const questionsService = new QuestionsService();
