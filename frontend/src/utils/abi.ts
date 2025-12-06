import { ORACLE_HUB_ADDRESS, QR_PAYMENT_ADDRESS, USDT_ADDRESS } from "./config";

const CONTRACTS = {
  USDT: USDT_ADDRESS,
  ORACLE_HUB: ORACLE_HUB_ADDRESS,
  QR_PAYMENT: QR_PAYMENT_ADDRESS,
};

// Complete USDT ABI (MockUSDT + ERC20)
const USDT_ABI = [
  {
    name: "totalSupply",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
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
    name: "transferFrom",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    name: "mint",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "name",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
  {
    name: "symbol",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8" }],
  },
  {
    name: "Transfer",
    type: "event",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "value", type: "uint256", indexed: false },
    ],
  },
  {
    name: "Approval",
    type: "event",
    inputs: [
      { name: "owner", type: "address", indexed: true },
      { name: "spender", type: "address", indexed: true },
      { name: "value", type: "uint256", indexed: false },
    ],
  },
] as const;

// Complete Oracle Hub ABI (SimpleOracleHub)
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
  {
    name: "getRupiahEquivalent",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "_token", type: "address" },
      { name: "_tokenAmount", type: "uint256" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "updateRate",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_token", type: "address" },
      { name: "_newRate", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "setAuthorizedUpdater",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_updater", type: "address" },
      { name: "_status", type: "bool" },
    ],
    outputs: [],
  },
  {
    name: "getRate",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_token", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "tokenToRupiahRate",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "authorizedUpdater",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ type: "bool" }],
  },
  {
    name: "owner",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
  {
    name: "NATIVE",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
  {
    name: "RateUpdated",
    type: "event",
    inputs: [
      { name: "token", type: "address", indexed: true },
      { name: "newRate", type: "uint256", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
  {
    name: "UpdaterStatusChanged",
    type: "event",
    inputs: [
      { name: "updater", type: "address", indexed: true },
      { name: "status", type: "bool", indexed: false },
    ],
  },
] as const;

// Complete QR Payment ABI (UMKMQRPayment)
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
    name: "payQRNative",
    type: "function",
    stateMutability: "payable",
    inputs: [
      { name: "_orderId", type: "string" },
      { name: "_referenceString", type: "string" },
      { name: "_rupiahAmount", type: "uint256" },
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
  {
    name: "settleQROrder",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_beneficiary", type: "address" },
      { name: "_orderDataHash", type: "bytes32" },
    ],
    outputs: [],
  },
  {
    name: "settleQROrderNative",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_beneficiary", type: "address" },
      { name: "_orderDataHash", type: "bytes32" },
    ],
    outputs: [],
  },
  {
    name: "getPaymentInfo",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_orderHash", type: "bytes32" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "tokenAddress", type: "address" },
          { name: "tokenAmountTotal", type: "uint256" },
          { name: "rupiahAmountTotal", type: "uint256" },
          { name: "tokenAmountIssued", type: "uint256" },
        ],
      },
    ],
  },
  {
    name: "paymentsFromOrder",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "", type: "bytes32" }],
    outputs: [
      { name: "tokenAddress", type: "address" },
      { name: "tokenAmountTotal", type: "uint256" },
      { name: "rupiahAmountTotal", type: "uint256" },
      { name: "tokenAmountIssued", type: "uint256" },
    ],
  },
  {
    name: "friendlyBot",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ type: "bool" }],
  },
  {
    name: "changeBotStatus",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_botAddress", type: "address" },
      { name: "_status", type: "bool" },
    ],
    outputs: [],
  },
  {
    name: "ORACLE_HUB",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
  {
    name: "NATIVE",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
  {
    name: "owner",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
  {
    name: "PaymentCreated",
    type: "event",
    inputs: [
      { name: "creator", type: "address", indexed: true },
      { name: "orderId", type: "string", indexed: false },
      { name: "tokenAddress", type: "address", indexed: true },
      { name: "rupiahAmount", type: "uint256", indexed: false },
      { name: "orderDataHash", type: "bytes32", indexed: true },
    ],
  },
  {
    name: "PaymentReceived",
    type: "event",
    inputs: [
      { name: "payer", type: "address", indexed: true },
      { name: "orderId", type: "string", indexed: false },
      { name: "referenceString", type: "string", indexed: false },
      { name: "tokenAddress", type: "address", indexed: true },
      { name: "tokenAmount", type: "uint256", indexed: false },
      { name: "rupiahAmount", type: "uint256", indexed: false },
      { name: "orderDataHash", type: "bytes32", indexed: true },
    ],
  },
  {
    name: "OrderSettled",
    type: "event",
    inputs: [
      { name: "beneficiary", type: "address", indexed: false },
      { name: "tokenAddress", type: "address", indexed: false },
      { name: "tokenAmount", type: "uint256", indexed: false },
      { name: "rupiahAmount", type: "uint256", indexed: false },
      { name: "orderDataHash", type: "bytes32", indexed: false },
    ],
  },
] as const;

export default {
  USDT_ABI,
  ORACLE_ABI,
  QR_PAYMENT_ABI,
  CONTRACTS,
};
