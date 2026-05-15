import { create } from "zustand";

interface PlayerProfile {
  exists: boolean;
  nickname: string;
  avatar: string;
  bestScore: bigint;
  totalScore: bigint;
  gamesPlayed: bigint;
  createdAt: bigint;
  lastSubmittedAt: bigint;
}

interface GameState {
  // Game state
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  score: number;
  combo: number;
  duration: number;
  sessionId: string;

  // Profile
  profile: PlayerProfile | null;
  hasProfile: boolean;

  // UI
  showProfileModal: boolean;
  showScoreModal: boolean;
  showLeaderboard: boolean;

  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: (score: number, combo: number, duration: number) => void;
  resetGame: () => void;
  setProfile: (profile: PlayerProfile | null) => void;
  setHasProfile: (has: boolean) => void;
  setShowProfileModal: (show: boolean) => void;
  setShowScoreModal: (show: boolean) => void;
  setShowLeaderboard: (show: boolean) => void;
}

function generateSessionId(): string {
  return "0x" + Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
}

export const useGameStore = create<GameState>((set) => ({
  isPlaying: false,
  isPaused: false,
  isGameOver: false,
  score: 0,
  combo: 0,
  duration: 0,
  sessionId: generateSessionId(),
  profile: null,
  hasProfile: false,
  showProfileModal: false,
  showScoreModal: false,
  showLeaderboard: false,

  startGame: () =>
    set({
      isPlaying: true,
      isPaused: false,
      isGameOver: false,
      score: 0,
      combo: 0,
      duration: 0,
      sessionId: generateSessionId(),
      showScoreModal: false,
    }),

  pauseGame: () => set({ isPaused: true }),
  resumeGame: () => set({ isPaused: false }),

  endGame: (score: number, combo: number, duration: number) =>
    set({
      isPlaying: false,
      isGameOver: true,
      score,
      combo,
      duration,
      showScoreModal: true,
    }),

  resetGame: () =>
    set({
      isPlaying: false,
      isPaused: false,
      isGameOver: false,
      score: 0,
      combo: 0,
      duration: 0,
      sessionId: generateSessionId(),
      showScoreModal: false,
    }),

  setProfile: (profile) => set({ profile }),
  setHasProfile: (hasProfile) => set({ hasProfile }),
  setShowProfileModal: (showProfileModal) => set({ showProfileModal }),
  setShowScoreModal: (showScoreModal) => set({ showScoreModal }),
  setShowLeaderboard: (showLeaderboard) => set({ showLeaderboard }),
}));
