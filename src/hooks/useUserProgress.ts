import { useState, useCallback } from "react";
import type { UserProgress, TopicKey } from "@/lib/academiaTypes";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "galois_progress";

const defaultProgress = (): UserProgress => ({
  xp: 0,
  level: 1,
  streak: 0,
  lastActiveDate: "",
  achievements: [],
  topicMastery: {
    aritmetica: 0,
    algebra: 0,
    geometria: 0,
    trigonometria: 0,
    probabilidade: 0,
  },
});

const loadProgress = (): UserProgress => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    return { ...defaultProgress(), ...JSON.parse(raw) };
  } catch {
    return defaultProgress();
  }
};

const saveProgress = (p: UserProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // localStorage might be unavailable
  }
};

const todayStr = () => new Date().toISOString().slice(0, 10);
const yesterdayStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

const initProgress = (): UserProgress => {
  const p = loadProgress();
  const today = todayStr();
  const yesterday = yesterdayStr();

  if (p.lastActiveDate === today) {
    // Same day – keep streak as-is
  } else if (p.lastActiveDate === yesterday) {
    p.streak = p.streak + 1;
  } else {
    p.streak = 1; // broken streak or first time
  }
  p.lastActiveDate = today;
  saveProgress(p);
  return p;
};

export const useUserProgress = () => {
  const { toast } = useToast();
  const [progress, setProgress] = useState<UserProgress>(initProgress);

  const addXP = useCallback(
    (amount: number) => {
      setProgress((prev) => {
        const xp = prev.xp + amount;
        const level = Math.floor(xp / 200) + 1;
        const updated: UserProgress = { ...prev, xp, level };

        // Find newly unlocked achievements
        const newAchievements = ACHIEVEMENTS.filter(
          (a) => !updated.achievements.includes(a.id) && a.condition(updated)
        );

        if (newAchievements.length > 0) {
          updated.achievements = [
            ...updated.achievements,
            ...newAchievements.map((a) => a.id),
          ];
          // Show toasts outside of setState via microtask
          queueMicrotask(() => {
            newAchievements.forEach((a) => {
              toast({
                title: `${a.icon} ${a.title}`,
                description: a.description,
                duration: 4000,
              });
            });
          });
        }

        saveProgress(updated);
        return updated;
      });
    },
    [toast]
  );

  const markTopicPlayed = useCallback((topic: TopicKey, scorePercent: number) => {
    setProgress((prev) => {
      const current = prev.topicMastery[topic] ?? 0;
      const mastery = Math.min(100, Math.max(current, Math.round(scorePercent)));
      const updated: UserProgress = {
        ...prev,
        topicMastery: { ...prev.topicMastery, [topic]: mastery },
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const resetProgress = useCallback(() => {
    const p = defaultProgress();
    p.lastActiveDate = todayStr();
    p.streak = 1;
    saveProgress(p);
    setProgress(p);
  }, []);

  return { progress, addXP, markTopicPlayed, resetProgress };
};
