"use client";

import { useEffect, useState } from "react";
import { useGenerateProfile } from "@/hooks/use-contract";
import { useGameStore } from "@/store/game-store";

const AVATAR_OPTIONS = [
  "🎾", "🏆", "⭐", "🔥", "💎", "🎯", "🚀", "🌟", "⚡", "👑",
];

export function ProfileModal() {
  const { showProfileModal, setShowProfileModal } = useGameStore();
  const [nickname, setNickname] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
  const { generate, isPending, isConfirmed } = useGenerateProfile();

  useEffect(() => {
    if (isConfirmed) {
      setTimeout(() => {
        setShowProfileModal(false);
        window.location.reload();
      }, 1200);
    }
  }, [isConfirmed, setShowProfileModal]);

  if (!showProfileModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    generate(nickname.trim(), selectedAvatar);
  };

  if (isConfirmed) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="mx-4 max-w-sm rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 p-8 text-center shadow-2xl">
          <div className="mb-4 text-6xl">🎉</div>
          <h2 className="mb-2 text-2xl font-bold text-white">Profile Created!</h2>
          <p className="mb-6 text-white/90">You are ready to play!</p>
          <button
            onClick={() => setShowProfileModal(false)}
            className="rounded-xl bg-white px-6 py-3 font-bold text-emerald-600 shadow-lg transition-transform hover:scale-105"
          >
            Let&apos;s Play!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-6 shadow-2xl">
        <h2 className="mb-1 text-center text-2xl font-bold text-white">
          Create Player Profile
        </h2>
        <p className="mb-6 text-center text-white/80">
          Set up your identity on Arc Testnet
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-white">
              Nickname
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter your nickname"
              maxLength={20}
              className="w-full rounded-xl border-2 border-white/30 bg-white/20 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-white focus:bg-white/30"
              required
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-white">
              Choose Avatar
            </label>
            <div className="grid grid-cols-5 gap-2">
              {AVATAR_OPTIONS.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`flex h-12 items-center justify-center rounded-xl text-2xl transition-all ${
                    selectedAvatar === avatar
                      ? "scale-110 bg-white shadow-lg"
                      : "bg-white/20 hover:bg-white/40"
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending || !nickname.trim()}
            className="w-full rounded-xl bg-white py-3 font-bold text-purple-600 shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isPending ? "Creating..." : "Generate Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
