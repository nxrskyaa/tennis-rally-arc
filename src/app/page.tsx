"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { SimpleWalletButton } from "@/components/simple-wallet-button";
import { TennisGame } from "@/components/tennis-game";
import { NetworkWarning } from "@/components/network-warning";
import { ProfileModal } from "@/components/profile-modal";
import { ScoreModal } from "@/components/score-modal";
import { Leaderboard } from "@/components/leaderboard";
import { useHasProfile, useGetPlayer, useIsCorrectNetwork } from "@/hooks/use-contract";
import { useGameStore } from "@/store/game-store";

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
    if (!isConnected) {
      setHasProfile(false);
      setProfile(null);
      return;
    }

    if (hasProfileData !== undefined) {
      setHasProfile(hasProfileData);
    }
  }, [hasProfileData, isConnected, setHasProfile, setProfile]);

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

  const canSubmitOnchain = isConnected && isCorrectNetwork && hasProfile;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#164e63_0%,#0f172a_38%,#020617_100%)] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-[-8%] top-32 h-80 w-80 rounded-full bg-lime-400/10 blur-3xl" />
        <div className="absolute bottom-[-12%] left-1/3 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-4 py-4 sm:px-8">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3 text-left"
          aria-label="Tennis Rally home"
        >
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-2xl shadow-lg shadow-cyan-500/10 ring-1 ring-white/15 backdrop-blur">🎾</span>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white">Tennis Rally</h1>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200/70">Arc Testnet</p>
          </div>
        </button>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowLeaderboard(true)}
            className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-bold text-white shadow-lg shadow-black/20 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20 sm:px-4"
          >
            🏆 <span className="hidden sm:inline">Leaderboard</span>
          </button>
          <SimpleWalletButton />
        </div>
      </header>

      <section className="relative z-10 mx-auto grid max-w-6xl gap-8 px-4 pb-6 pt-4 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-100 shadow-lg shadow-cyan-500/10 backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-lime-300" />
            No WalletConnect • Injected wallet only
          </div>

          <div>
            <h2 className="max-w-xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              Smash rallies. Climb the on-chain board.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
              Main dulu tanpa ribet. Connect MetaMask / injected wallet cuma kalau mau bikin profil dan submit score ke Arc Testnet.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-lg">
            <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 shadow-lg shadow-black/20 backdrop-blur">
              <div className="text-2xl font-black text-lime-300">1 USDC</div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Submit fee</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 shadow-lg shadow-black/20 backdrop-blur">
              <div className="text-2xl font-black text-cyan-300">3</div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Lives</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 shadow-lg shadow-black/20 backdrop-blur">
              <div className="text-2xl font-black text-fuchsia-300">∞</div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Practice</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <SimpleWalletButton />
            {isConnected && isCorrectNetwork && !hasProfile && (
              <button
                onClick={() => setShowProfileModal(true)}
                className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-fuchsia-500/25 transition hover:-translate-y-0.5 hover:scale-105"
              >
                Create Player Profile
              </button>
            )}
            <button
              onClick={() => setShowLeaderboard(true)}
              className="rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              View Leaderboard
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300 shadow-xl shadow-black/20 backdrop-blur">
            {!isConnected ? (
              <>Mode: <span className="font-bold text-lime-300">Practice</span> — score bisa dimainkan sekarang, connect nanti buat submit.</>
            ) : !isCorrectNetwork ? (
              <>Mode: <span className="font-bold text-yellow-300">Wrong network</span> — switch ke Arc Testnet untuk on-chain.</>
            ) : hasProfile ? (
              <>Mode: <span className="font-bold text-cyan-300">On-chain ready</span> — profile aktif, score bisa disubmit.</>
            ) : (
              <>Mode: <span className="font-bold text-fuchsia-300">Profile needed</span> — bikin profil dulu buat submit score.</>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <TennisGame />
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>🖱️ Mouse move</span>
            <span>👆 Touch drag</span>
            <span>⏯️ Click/tap pause</span>
          </div>
        </div>
      </section>

      {isConnected && isCorrectNetwork && !hasProfile && (
        <section className="relative z-10 mx-auto max-w-4xl px-4 pb-10 sm:px-8">
          <div className="rounded-3xl border border-fuchsia-300/20 bg-fuchsia-500/10 p-5 text-center shadow-xl shadow-fuchsia-500/10 backdrop-blur">
            <div className="text-4xl">👤</div>
            <h3 className="mt-2 text-2xl font-black">Create your player profile</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-300">
              Profil dibutuhkan untuk leaderboard on-chain. Game tetap bisa dimainkan tanpa profil, tapi submit score butuh profil Arc.
            </p>
            <button
              onClick={() => setShowProfileModal(true)}
              className="mt-4 rounded-xl bg-white px-6 py-3 font-black text-fuchsia-600 shadow-lg transition hover:scale-105"
            >
              Generate Player Profile
            </button>
          </div>
        </section>
      )}

      {canSubmitOnchain && playerData && (
        <section className="relative z-10 mx-auto max-w-4xl px-4 pb-10 sm:px-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-center backdrop-blur">
              <div className="text-lg font-black text-white">{playerData[1] || "Player"}</div>
              <div className="text-2xl">{playerData[2]}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-center backdrop-blur">
              <div className="text-2xl font-black text-yellow-300">{playerData[3].toString()}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Best Score</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-center backdrop-blur">
              <div className="text-2xl font-black text-cyan-300">{playerData[5].toString()}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Games</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-center backdrop-blur">
              <div className="text-2xl font-black text-lime-300">{playerData[4].toString()}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Score</div>
            </div>
          </div>
        </section>
      )}

      <NetworkWarning />
      <ProfileModal />
      <ScoreModal />
      <Leaderboard />
    </main>
  );
}
