"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useApproveUSDC, useSubmitScore, useAllowance } from "@/hooks/use-contract";
import { useGameStore } from "@/store/game-store";
import { SUBMIT_SCORE_FEE } from "@/lib/contracts";

export function ScoreModal() {
  const { showScoreModal, setShowScoreModal, score, combo, duration, sessionId } =
    useGameStore();
  const { address, isConnected } = useAccount();
  const { data: allowance } = useAllowance(address);
  const { approve, isPending: isApproving, isConfirmed: isApproved } = useApproveUSDC();
  const { submit, isPending: isSubmitting, isConfirmed: isSubmitted } = useSubmitScore();
  const [step, setStep] = useState<"approve" | "submit" | "done">("approve");

  useEffect(() => {
    if (isSubmitted) {
      setTimeout(() => window.location.reload(), 1500);
    }
  }, [isSubmitted]);

  if (!showScoreModal) return null;

  const needsApproval = !allowance || allowance < SUBMIT_SCORE_FEE;
  const readyToSubmit = !needsApproval || isApproved || step === "submit";

  const handleApprove = () => {
    approve();
  };

  const handleSubmit = () => {
    submit(BigInt(score), BigInt(combo), BigInt(duration), sessionId as `0x${string}`);
    setStep("done");
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="mx-4 max-w-sm rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 p-8 text-center shadow-2xl">
          <div className="mb-4 text-6xl">🏆</div>
          <h2 className="mb-2 text-2xl font-bold text-white">Score Submitted!</h2>
          <p className="mb-2 text-white/90">Your score is now on-chain.</p>
          <div className="mb-6 rounded-xl bg-white/20 p-4">
            <div className="text-3xl font-bold text-white">{score}</div>
            <div className="text-sm text-white/70">points</div>
          </div>
          <button
            onClick={() => {
              setShowScoreModal(false);
              useGameStore.getState().resetGame();
            }}
            className="rounded-xl bg-white px-6 py-3 font-bold text-emerald-600 shadow-lg transition-transform hover:scale-105"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 p-6 shadow-2xl">
        <h2 className="mb-1 text-center text-2xl font-bold text-white">Game Over!</h2>
        <p className="mb-6 text-center text-white/80">
          {isConnected ? "Submit your score to the leaderboard" : "Connect wallet to submit, or play again in practice mode"}
        </p>

        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-white/20 p-3 text-center">
            <div className="text-2xl font-bold text-white">{score}</div>
            <div className="text-xs text-white/70">Score</div>
          </div>
          <div className="rounded-xl bg-white/20 p-3 text-center">
            <div className="text-2xl font-bold text-white">{combo}</div>
            <div className="text-xs text-white/70">Combo</div>
          </div>
          <div className="rounded-xl bg-white/20 p-3 text-center">
            <div className="text-2xl font-bold text-white">{duration}s</div>
            <div className="text-xs text-white/70">Duration</div>
          </div>
        </div>

        <div className="mb-4 rounded-xl bg-white/10 p-3 text-center text-sm text-white/80">
          {isConnected ? "Fee: 1 USDC" : "Practice score — wallet not connected"}
        </div>

        {!isConnected ? (
          <div className="rounded-xl bg-white/10 p-3 text-center text-sm text-white/80">
            Connect an injected wallet from the top bar if you want to submit scores on-chain.
          </div>
        ) : needsApproval && !readyToSubmit ? (
          <button
            onClick={handleApprove}
            disabled={isApproving}
            className="w-full rounded-xl bg-white py-3 font-bold text-blue-600 shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isApproving ? "Approving USDC..." : "Approve USDC"}
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full rounded-xl bg-white py-3 font-bold text-blue-600 shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Score"}
          </button>
        )}

        <button
          onClick={() => {
            setShowScoreModal(false);
            useGameStore.getState().resetGame();
          }}
          className="mt-3 w-full rounded-xl py-2 text-sm text-white/60 transition hover:text-white"
        >
          {isConnected ? "Skip & Play Again" : "Play Again"}
        </button>
      </div>
    </div>
  );
}
