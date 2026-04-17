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
