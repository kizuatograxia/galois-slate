import type { UserProgress } from "./academiaTypes";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (p: UserProgress) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_xp",
    icon: "🌱",
    title: "Primeiro Passo",
    description: "Ganhe seu primeiro XP.",
    condition: (p) => p.xp >= 10,
  },
  {
    id: "streak_3",
    icon: "🔥",
    title: "Em Chamas",
    description: "3 dias de streak.",
    condition: (p) => p.streak >= 3,
  },
  {
    id: "streak_7",
    icon: "⚡",
    title: "Semana Perfeita",
    description: "7 dias de streak.",
    condition: (p) => p.streak >= 7,
  },
  {
    id: "level_5",
    icon: "📐",
    title: "Estudante",
    description: "Alcance o nível 5.",
    condition: (p) => p.level >= 5,
  },
  {
    id: "level_10",
    icon: "🎓",
    title: "Mestre dos Grupos",
    description: "Alcance o nível 10.",
    condition: (p) => p.level >= 10,
  },
  {
    id: "mastery_100",
    icon: "💎",
    title: "Maestria Absoluta",
    description: "100% em qualquer tópico.",
    condition: (p) => Object.values(p.topicMastery).some((v) => v >= 100),
  },
  {
    id: "all_topics",
    icon: "🌐",
    title: "Polímata",
    description: "Jogue todos os 5 tópicos.",
    condition: (p) => Object.values(p.topicMastery).every((v) => v > 0),
  },
  {
    id: "xp_500",
    icon: "⭐",
    title: "Quinhentos",
    description: "Acumule 500 XP.",
    condition: (p) => p.xp >= 500,
  },
];
