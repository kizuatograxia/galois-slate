export type Difficulty = "iniciante" | "intermediario" | "avancado";

export type TopicKey =
  | "aritmetica"
  | "algebra"
  | "geometria"
  | "trigonometria"
  | "probabilidade";

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  achievements: string[];
  topicMastery: Record<TopicKey, number>;
}

export interface Question {
  id: string;
  topic: TopicKey;
  difficulty: Difficulty;
  prompt: string;
  promptLatex?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  explanationLatex?: string;
  historicalNote: string;
  xpReward: number;
}

export interface SessionResult {
  correct: number;
  total: number;
  xpEarned: number;
  topic: TopicKey;
  difficulty: Difficulty;
}

export const XP_BY_DIFFICULTY: Record<Difficulty, number> = {
  iniciante: 10,
  intermediario: 20,
  avancado: 35,
};

export const TOPIC_LABELS: Record<TopicKey, string> = {
  aritmetica: "Aritmética",
  algebra: "Álgebra",
  geometria: "Geometria",
  trigonometria: "Trigonometria",
  probabilidade: "Probabilidade",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};
