"use client";

import { useAccount, useSwitchChain } from "wagmi";
import { ARC_TESTNET } from "@/lib/contracts";
import { useIsCorrectNetwork } from "@/hooks/use-contract";

export function NetworkWarning() {
  const { isConnected } = useAccount();
  const isCorrectNetwork = useIsCorrectNetwork();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected || isCorrectNetwork) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="mx-4 max-w-md rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 p-6 text-center shadow-2xl">
        <div className="mb-4 text-5xl">⚠️</div>
        <h2 className="mb-2 text-xl font-bold text-white">
          Wrong Network
        </h2>
        <p className="mb-6 text-white/90">
          Please switch to Arc Testnet to continue.
        </p>
        <button
          onClick={() => switchChain?.({ chainId: ARC_TESTNET.id })}
          disabled={isPending}
          className="rounded-xl bg-white px-6 py-3 font-bold text-orange-600 shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          {isPending ? "Switching..." : "Switch to Arc Testnet"}
        </button>
      </div>
    </div>
  );
}
