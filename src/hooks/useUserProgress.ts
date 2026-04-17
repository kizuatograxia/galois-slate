import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";
import type { TopicKey, UserProgress } from "@/lib/academiaTypes";
import { ACHIEVEMENTS } from "@/lib/achievements";

const STORAGE_KEY = "galois_progress";

const DEFAULT_PROGRESS: UserProgress = {
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
};

const todayISO = () => new Date().toISOString().slice(0, 10);

const yesterdayISO = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

const computeLevel = (xp: number) => Math.floor(xp / 200) + 1;

const loadInitial = (): UserProgress => {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      topicMastery: { ...DEFAULT_PROGRESS.topicMastery, ...(parsed.topicMastery ?? {}) },
      achievements: parsed.achievements ?? [],
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
};

const persist = (p: UserProgress) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
};

export const useUserProgress = () => {
  const [progress, setProgress] = useState<UserProgress>(loadInitial);
  const initRef = useRef(false);

  // Streak update on mount
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    setProgress((prev) => {
      const today = todayISO();
      let streak = prev.streak;
      if (prev.lastActiveDate === today) {
        // same day → keep
      } else if (prev.lastActiveDate === yesterdayISO()) {
        streak = prev.streak + 1;
      } else {
        streak = 1;
      }
      const next = { ...prev, streak, lastActiveDate: today };
      persist(next);
      return next;
    });
  }, []);

  const checkAchievements = useCallback((updated: UserProgress): UserProgress => {
    const unlocked = ACHIEVEMENTS.filter(
      (a) => !updated.achievements.includes(a.id) && a.condition(updated),
    );
    if (unlocked.length === 0) return updated;
    unlocked.forEach((a) => {
      toast({
        title: a.title,
        description: a.description,
        duration: 4000,
      });
    });
    return { ...updated, achievements: [...updated.achievements, ...unlocked.map((a) => a.id)] };
  }, []);

  const addXP = useCallback(
    (amount: number) => {
      setProgress((prev) => {
        const xp = prev.xp + amount;
        const level = computeLevel(xp);
        let next: UserProgress = { ...prev, xp, level };
        next = checkAchievements(next);
        persist(next);
        return next;
      });
    },
    [checkAchievements],
  );

  const markTopicPlayed = useCallback(
    (topic: TopicKey, scorePercent: number) => {
      setProgress((prev) => {
        const previousValue = prev.topicMastery[topic] ?? 0;
        const newValue = Math.min(100, Math.max(previousValue, Math.round(scorePercent)));
        const topicMastery = { ...prev.topicMastery, [topic]: newValue };
        let next: UserProgress = { ...prev, topicMastery };
        next = checkAchievements(next);
        persist(next);
        return next;
      });
    },
    [checkAchievements],
  );

  const resetProgress = useCallback(() => {
    const fresh = { ...DEFAULT_PROGRESS, lastActiveDate: todayISO(), streak: 1 };
    persist(fresh);
    setProgress(fresh);
  }, []);

  return { progress, addXP, markTopicPlayed, resetProgress };
};
