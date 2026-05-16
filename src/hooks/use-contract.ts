"use client";

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import {
  CONTRACT_ADDRESS,
  USDC_ADDRESS,
  CONTRACT_ABI,
  ERC20_ABI,
  SUBMIT_SCORE_FEE,
} from "@/lib/contracts";

export function useHasProfile(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "hasProfile",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}

export function useGetPlayer(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getPlayer",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}

export function useGetMyProfile(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getMyProfile",
    query: { enabled: !!address },
  });
}

export function useGetTopScores() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getTopScores",
  });
}

export function useGetTopScoresCount() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getTopScoresCount",
  });
}

export function useAllowance(owner: `0x${string}` | undefined) {
  return useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: owner && CONTRACT_ADDRESS ? [owner, CONTRACT_ADDRESS] : undefined,
    query: { enabled: !!owner },
  });
}

export function useGenerateProfile() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const generate = (nickname: string, avatar: string) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "generateProfile",
      args: [nickname, avatar],
    });
  };

  return { generate, hash, isPending, isConfirming, isConfirmed, error };
}

export function useApproveUSDC() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const approve = () => {
    writeContract({
      address: USDC_ADDRESS,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [CONTRACT_ADDRESS, SUBMIT_SCORE_FEE],
    });
  };

  return { approve, hash, isPending, isConfirming, isConfirmed, error };
}

export function useSubmitScore() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const submit = (
    score: bigint,
    combo: bigint,
    duration: bigint,
    sessionId: `0x${string}`
  ) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "submitScore",
      args: [score, combo, duration, sessionId],
    });
  };

  return { submit, hash, isPending, isConfirming, isConfirmed, error };
}

export function useIsCorrectNetwork() {
  const chainId = useChainId();
  return chainId === 5042002;
}
