import { ORACLE_HUB_ADDRESS, QR_PAYMENT_ADDRESS, USDT_ADDRESS } from "./config";

const CONTRACTS = {
  USDT: USDT_ADDRESS,
  ORACLE_HUB: ORACLE_HUB_ADDRESS,
  QR_PAYMENT: QR_PAYMENT_ADDRESS,
};

const USDT_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
] as const;

const ORACLE_ABI = [
  {
    name: "getTokenEquivalent",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "_token", type: "address" },
      { name: "_rupiahAmount", type: "uint256" },
    ],
    outputs: [{ type: "uint256" }],
  },
] as const;

const QR_PAYMENT_ABI = [
  {
    name: "payQR",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_token", type: "address" },
      { name: "_rupiahAmount", type: "uint256" },
      { name: "_orderId", type: "string" },
      { name: "_referenceString", type: "string" },
    ],
    outputs: [],
  },
  {
    name: "getOrderHash",
    type: "function",
    stateMutability: "pure",
    inputs: [
      {
        name: "_orderData",
        type: "tuple",
        components: [
          { name: "orderId", type: "string" },
          { name: "referenceString", type: "string" },
          { name: "tokenAddress", type: "address" },
          { name: "creator", type: "address" },
        ],
      },
    ],
    outputs: [{ type: "bytes32" }],
  },
] as const;

export default {
  USDT_ABI,
  ORACLE_ABI,
  QR_PAYMENT_ABI,
  CONTRACTS,
};
