"use client";

import { useGetTopScores } from "@/hooks/use-contract";
import { useGameStore } from "@/store/game-store";

export function Leaderboard() {
  const { showLeaderboard, setShowLeaderboard } = useGameStore();
  const { data: topScores, isLoading } = useGetTopScores();

  if (!showLeaderboard) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-lg rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">🏆 Leaderboard</h2>
          <button
            onClick={() => setShowLeaderboard(false)}
            className="rounded-full bg-white/20 p-2 text-white transition hover:bg-white/30"
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-white">Loading...</div>
        ) : !topScores || topScores.length === 0 ? (
          <div className="py-8 text-center text-white/70">No scores yet. Be the first!</div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {topScores.map((entry, index) => (
              <div
                key={`${entry.player}-${index}`}
                className={`flex items-center gap-3 rounded-xl p-3 ${
                  index === 0
                    ? "bg-yellow-300/30"
                    : index === 1
                    ? "bg-gray-300/20"
                    : index === 2
                    ? "bg-orange-400/20"
                    : "bg-white/10"
                }`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 font-bold text-white">
                  {index + 1}
                </div>
                <div className="flex-1 truncate font-mono text-sm text-white">
                  {entry.player}
                </div>
                <div className="font-bold text-white">
                  {entry.bestScore.toString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
