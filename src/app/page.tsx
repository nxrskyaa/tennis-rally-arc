"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { SimpleWalletButton } from "@/components/simple-wallet-button";
import { TennisGame } from "@/components/tennis-game";
import { NetworkWarning } from "@/components/network-warning";
import { ProfileModal } from "@/components/profile-modal";
import { ScoreModal } from "@/components/score-modal";
import { Leaderboard } from "@/components/leaderboard";
import { useHasProfile, useGetPlayer } from "@/hooks/use-contract";
import { useGameStore } from "@/store/game-store";
import { useIsCorrectNetwork } from "@/hooks/use-contract";

export default function Home() {
  const { address, isConnected } = useAccount();
  const isCorrectNetwork = useIsCorrectNetwork();
  const { data: hasProfileData } = useHasProfile(address);
  const { data: playerData } = useGetPlayer(address);
  const {
    hasProfile,
    setHasProfile,
    setProfile,
    setShowProfileModal,
    setShowLeaderboard,
    pauseGame,
  } = useGameStore();

  useEffect(() => {
    if (hasProfileData !== undefined) {
      setHasProfile(hasProfileData);
    }
  }, [hasProfileData, setHasProfile]);

  useEffect(() => {
    if (playerData) {
      setProfile({
        exists: playerData[0],
        nickname: playerData[1],
        avatar: playerData[2],
        bestScore: playerData[3],
        totalScore: playerData[4],
        gamesPlayed: playerData[5],
        createdAt: playerData[6],
        lastSubmittedAt: playerData[7],
      });
    }
  }, [playerData, setProfile]);

  useEffect(() => {
    if (isConnected && !isCorrectNetwork) {
      pauseGame();
    }
  }, [isConnected, isCorrectNetwork, pauseGame]);

  const handleGenerateProfile = () => {
    setShowProfileModal(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎾</span>
          <div>
            <h1 className="text-xl font-bold text-white">Tennis Rally</h1>
            <p className="text-xs text-white/50">on Arc Testnet</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLeaderboard(true)}
            className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
          >
            🏆 Leaderboard
          </button>
          <SimpleWalletButton />
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 pb-8">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-6 text-6xl">🎾</div>
            <h2 className="mb-2 text-3xl font-bold text-white">
              Welcome to Tennis Rally
            </h2>
            <p className="mb-8 max-w-md text-center text-white/60">
              Connect your wallet to play the arcade tennis game on Arc Testnet.
              Submit your scores on-chain!
            </p>
            <SimpleWalletButton />
          </div>
        ) : !isCorrectNetwork ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-6 text-6xl">⚠️</div>
            <h2 className="mb-2 text-2xl font-bold text-white">
              Wrong Network
            </h2>
            <p className="mb-4 text-white/60">
              Please switch to Arc Testnet to continue.
            </p>
          </div>
        ) : !hasProfile ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-6 text-6xl">👤</div>
            <h2 className="mb-2 text-2xl font-bold text-white">
              No Player Profile
            </h2>
            <p className="mb-6 max-w-md text-center text-white/60">
              You need to create a player profile before you can play and submit
              scores to the leaderboard.
            </p>
            <button
              onClick={handleGenerateProfile}
              className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              Generate Player Profile
            </button>
          </div>
        ) : (
          <>
            {/* Player Stats */}
            {playerData && (
              <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl bg-white/5 p-3 text-center">
                  <div className="text-lg font-bold text-white">
                    {playerData[1] || "Player"}
                  </div>
                  <div className="text-xs text-white/50">{playerData[2]}</div>
                </div>
                <div className="rounded-xl bg-white/5 p-3 text-center">
                  <div className="text-lg font-bold text-yellow-400">
                    {playerData[3].toString()}
                  </div>
                  <div className="text-xs text-white/50">Best Score</div>
                </div>
                <div className="rounded-xl bg-white/5 p-3 text-center">
                  <div className="text-lg font-bold text-cyan-400">
                    {playerData[5].toString()}
                  </div>
                  <div className="text-xs text-white/50">Games Played</div>
                </div>
                <div className="rounded-xl bg-white/5 p-3 text-center">
                  <div className="text-lg font-bold text-green-400">
                    {playerData[4].toString()}
                  </div>
                  <div className="text-xs text-white/50">Total Score</div>
                </div>
              </div>
            )}

            {/* Game */}
            <TennisGame />

            {/* Controls hint */}
            <div className="mt-4 text-center text-sm text-white/40">
              🖱️ Move mouse to control paddle • 👆 Drag on mobile • Click to pause
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <NetworkWarning />
      <ProfileModal />
      <ScoreModal />
      <Leaderboard />
    </main>
  );
}
