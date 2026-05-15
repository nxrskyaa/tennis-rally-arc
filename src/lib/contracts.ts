export const CONTRACT_ADDRESS = "0x492Ee458Ea47Af5360bFEcA2e3ee5767Cce660C7" as const;
export const USDC_ADDRESS = "0x3600000000000000000000000000000000000000" as const;
export const SUBMIT_SCORE_FEE = 1000000n; // 1 USDC (6 decimals)

export const ARC_TESTNET = {
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 6,
  },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.arc.network"] },
    public: { http: ["https://rpc.testnet.arc.network"] },
  },
  blockExplorers: {
    default: { name: "ArcScan", url: "https://testnet.arcscan.app" },
  },
} as const;

export const CONTRACT_ABI = [
  {
    inputs: [
      { name: "nickname", type: "string", internalType: "string" },
      { name: "avatar", type: "string", internalType: "string" },
    ],
    name: "generateProfile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "score", type: "uint256", internalType: "uint256" },
      { name: "combo", type: "uint256", internalType: "uint256" },
      { name: "duration", type: "uint256", internalType: "uint256" },
      { name: "sessionId", type: "bytes32", internalType: "bytes32" },
    ],
    name: "submitScore",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "playerAddress", type: "address", internalType: "address" }],
    name: "getPlayer",
    outputs: [
      { name: "exists", type: "bool", internalType: "bool" },
      { name: "nickname", type: "string", internalType: "string" },
      { name: "avatar", type: "string", internalType: "string" },
      { name: "bestScore", type: "uint256", internalType: "uint256" },
      { name: "totalScore", type: "uint256", internalType: "uint256" },
      { name: "gamesPlayed", type: "uint256", internalType: "uint256" },
      { name: "createdAt", type: "uint256", internalType: "uint256" },
      { name: "lastSubmittedAt", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMyProfile",
    outputs: [
      { name: "exists", type: "bool", internalType: "bool" },
      { name: "nickname", type: "string", internalType: "string" },
      { name: "avatar", type: "string", internalType: "string" },
      { name: "bestScore", type: "uint256", internalType: "uint256" },
      { name: "totalScore", type: "uint256", internalType: "uint256" },
      { name: "gamesPlayed", type: "uint256", internalType: "uint256" },
      { name: "createdAt", type: "uint256", internalType: "uint256" },
      { name: "lastSubmittedAt", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address", internalType: "address" }],
    name: "hasProfile",
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTopScores",
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct TennisRally.PlayerScore[]",
        components: [
          { name: "player", type: "address", internalType: "address" },
          { name: "bestScore", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTopScoresCount",
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getScoreHistoryCount",
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "index", type: "uint256", internalType: "uint256" }],
    name: "getScoreEntry",
    outputs: [
      { name: "player", type: "address", internalType: "address" },
      { name: "score", type: "uint256", internalType: "uint256" },
      { name: "combo", type: "uint256", internalType: "uint256" },
      { name: "duration", type: "uint256", internalType: "uint256" },
      { name: "timestamp", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "player", type: "address", internalType: "address" },
      { indexed: false, name: "nickname", type: "string", internalType: "string" },
      { indexed: false, name: "avatar", type: "string", internalType: "string" },
      { indexed: false, name: "timestamp", type: "uint256", internalType: "uint256" },
    ],
    name: "ProfileGenerated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "player", type: "address", internalType: "address" },
      { indexed: false, name: "score", type: "uint256", internalType: "uint256" },
      { indexed: false, name: "combo", type: "uint256", internalType: "uint256" },
      { indexed: false, name: "duration", type: "uint256", internalType: "uint256" },
      { indexed: false, name: "bestScore", type: "uint256", internalType: "uint256" },
      { indexed: false, name: "gamesPlayed", type: "uint256", internalType: "uint256" },
      { indexed: false, name: "feePaid", type: "uint256", internalType: "uint256" },
      { indexed: false, name: "timestamp", type: "uint256", internalType: "uint256" },
    ],
    name: "ScoreSubmitted",
    type: "event",
  },
] as const;

export const ERC20_ABI = [
  {
    inputs: [
      { name: "spender", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "owner", type: "address", internalType: "address" },
      { name: "spender", type: "address", internalType: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address", internalType: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8", internalType: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as const;