"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { ARC_TESTNET } from "@/lib/contracts";
import { useIsCorrectNetwork } from "@/hooks/use-contract";

function shortAddress(address?: string) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function SimpleWalletButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const isCorrectNetwork = useIsCorrectNetwork();

  const injectedConnector = connectors.find((connector) => connector.type === "injected") ?? connectors[0];

  if (!isConnected) {
    return (
      <button
        onClick={() => connect({ connector: injectedConnector })}
        disabled={isPending || !injectedConnector}
        className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-black text-white shadow-lg shadow-cyan-500/20 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Connecting..." : "Connect Wallet"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {!isCorrectNetwork && (
        <button
          onClick={() => switchChain?.({ chainId: ARC_TESTNET.id })}
          disabled={isSwitching}
          className="rounded-xl bg-yellow-400 px-3 py-2 text-xs font-black text-slate-950 shadow-lg transition hover:scale-105 disabled:opacity-50"
        >
          {isSwitching ? "Switching..." : "Switch Arc"}
        </button>
      )}
      <button
        onClick={() => disconnect()}
        className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
        title="Disconnect wallet"
      >
        {shortAddress(address)}
      </button>
    </div>
  );
}
