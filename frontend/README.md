Frontend Application Documentation
Overview
This is a modern web application built with React, TypeScript, and Vite that provides a business assistant chatbot interface with blockchain payment integration. The application features real-time chat via Socket.IO, wallet connectivity through Reown AppKit, and smart contract interactions for QR-based payments using USDT on Ethereum.
Tech Stack

Framework: React 19.2.0
Language: TypeScript 5.9.3
Build Tool: Vite 7.2.4
Styling: Tailwind CSS 4.1.17
UI Components: Radix UI primitives with shadcn/ui
State Management: React hooks + Context API
Routing: React Router DOM 7.9.6
Real-time Communication: Socket.IO Client 4.8.1
Blockchain:

Wagmi 3.0.2
Viem 2.40.3
Reown AppKit 1.8.14


HTTP Client: Axios 1.13.2
Animations: Framer Motion 12.23.25

Prerequisites

Node.js (v18 or higher)
npm or yarn
MetaMask or compatible Web3 wallet
Backend API running (see backend documentation)

Installation

Navigate to the frontend directory:

bashcd frontend

Install dependencies:

bashnpm install

Create a .env file in the frontend root directory:

env# Backend API
VITE_PUBLIC_BACKEND_URL=http://localhost:8888/api/v1
VITE_PUBLIC_WEBSOCKET_URL=ws://localhost:8888

# Reown AppKit (WalletConnect)
VITE_PUBLIC_REOWN_PROJECT_ID=your-reown-project-id

# Smart Contract Addresses (Sepolia testnet)
VITE_PUBLIC_ORACLE_HUB_ADDRESS=0x37...
VITE_PUBLIC_QR_PAYMENT_ADDRESS=0x30...
VITE_PUBLIC_USDT_ADDRESS=0xfd...
VITE_PUBLIC_REGISTRY_ADDRESS=0x08...
Running the Application
Development Mode
bashnpm run dev
The application will start at http://localhost:5173 with hot-reload enabled.
Production Mode
bashnpm run build
npm run preview
```

## Project Structure
```
frontend/
├── public/
│   ├── icon.svg              # App logo
│   └── vite.svg              # Vite logo
├── src/
│   ├── api/                  # API integration
│   │   ├── api.ts           # Axios instance with interceptors
│   │   ├── auth/            # Authentication endpoints
│   │   ├── chat/            # Chat endpoints
│   │   ├── settlement/      # Settlement endpoints
│   │   └── transaction/     # Transaction endpoints
│   ├── assets/              # Static assets
│   ├── components/
│   │   ├── dashboard/       # Dashboard-specific components
│   │   ├── homepage/        # Landing page components
│   │   ├── shared/          # Reusable components
│   │   ├── ui/              # shadcn/ui components
│   │   └── utils/           # Component utilities
│   ├── hooks/               # Custom React hooks
│   │   ├── useBotChunk.tsx
│   │   ├── useGetChatList.tsx
│   │   ├── useGetTx.tsx
│   │   └── useSpeechRecognition.tsx
│   ├── layouts/             # Layout components
│   │   ├── DashboardLayout.tsx
│   │   └── IndexLayout.tsx
│   ├── lib/
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils.ts         # Utility functions
│   ├── pages/               # Page components
│   │   ├── dashboard/       # Dashboard pages
│   │   └── IndexPage.tsx    # Landing page
│   ├── providers/           # Context providers
│   │   ├── AppKitProvider.tsx
│   │   ├── AuthProvider.tsx
│   │   └── ThemeProvider.tsx
│   ├── routers/             # Route configuration
│   │   ├── pages.tsx        # Lazy-loaded page exports
│   │   └── router.tsx       # Route definitions
│   ├── utils/               # Utility functions
│   │   ├── abi.ts           # Smart contract ABIs
│   │   ├── config.ts        # Environment configuration
│   │   ├── contract.ts      # Contract interaction hooks
│   │   ├── socket.ts        # Socket.IO client
│   │   └── theme*.ts        # Theme utilities
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── .env                     # Environment variables
├── package.json
├── tsconfig.json
├── vite.config.ts
└── components.json          # shadcn/ui configuration
Key Features
1. Authentication
The application uses wallet-based authentication:

Connect wallet via Reown AppKit (WalletConnect v3)
Automatic JWT token management
Session persistence in localStorage
Auto-logout on wallet disconnect

typescript// Usage in components
import { useAuth } from "@/providers/AuthProvider";

const { user, login, logout, isAuthenticated, isLoading } = useAuth();
2. Real-time Chat
WebSocket-based chat with AI assistant:

Socket.IO for real-time communication
Streaming responses from AI
Chat history persistence
Multi-language speech recognition (English & Indonesian)

typescript// Sending messages
import { sendQuestion } from "@/utils/socket";

sendQuestion({ question: "Hello" }, userId, chatId);

// Receiving responses
import { useBotChunk } from "@/hooks/useBotChunk";

useBotChunk(
  (data) => {
    // Handle streaming response chunks
  },
  (chatId) => {
    // Handle chat ID assignment
  }
);
3. Blockchain Integration
Smart contract interactions for QR-based payments:
Read Operations
typescriptimport { useUSDTBalance, useGetOracleRate } from "@/utils/contract";

// Get USDT balance
const { data: balance } = useUSDTBalance(address);

// Get exchange rate
const { data: rate } = useGetOracleRate(tokenAddress);
Write Operations
typescriptimport { usePayQRWithWait } from "@/utils/contract";

// Pay via QR code
const { payQR, isPending, isConfirmed } = usePayQRWithWait({
  token: CONTRACTS.USDT,
  rupiahAmount: parseRupiah("100000"),
  orderId: "ORDER-123",
  referenceString: "REF-456",
});
4. QR Code Generation & Scanning
Generate payment QR codes and scan them for payment:
typescript// Generate QR
import QRGenerator from "@/components/shared/QRGenerator";

<QRGenerator onGenerate={(data) => console.log(data)} />

// Scan QR
import ScanQR from "@/components/shared/ScanQR";

<ScanQR onScan={(result) => handlePayment(result)} />
5. Theme System
Support for light, dark, and system themes:
typescriptimport { useTheme } from "@/utils/themeUtils";

const { theme, setTheme } = useTheme();

// Set theme
setTheme("dark"); // "light" | "dark" | "system"
API Integration
All API calls go through a centralized Axios instance with automatic JWT token injection and error handling:
typescriptimport api from "@/api/api";

// GET request
const { data } = await api.get("/chat");

// POST request
const { data } = await api.post("/auth/me", { publicKey });
Available Endpoints
Authentication

POST /auth/me - Authenticate with wallet address

Chat

GET /chat - Get chat history with pagination
Query params: take, page, sortBy, sortOrder, search

Transactions

GET /tx - Get transactions with pagination
POST /tx - Create new transaction
PUT /tx/:txId - Update transaction status

Settlement

POST /settlement/settle - Settle QR payment order

Custom Hooks
useChats
Fetch and manage chat list:
typescriptconst { data, meta, loading, updateParams, refetch } = useChats({
  page: 1,
  take: 20,
});
useTransactions
Fetch and manage transactions:
typescriptconst { data, meta, loading, updateParams, refetch } = useTransactions({
  page: 1,
  take: 10,
});
useSpeechRecognition
Speech-to-text input:
typescriptconst {
  transcript,
  listening,
  currentLanguage,
  toggleListening,
  changeLanguage,
} = useSpeechRecognition({
  onTranscriptChange: (text) => setInput(text),
  language: "auto", // "en-US" | "id-ID" | "auto"
});
Smart Contract Utilities
Format & Parse Functions
typescriptimport {
  formatUSDT,
  parseUSDT,
  formatRupiah,
  parseRupiah,
} from "@/utils/contract";

// Format amounts for display
formatUSDT(1000000n); // "1.000000"
formatRupiah(100000000000000000000n); // "100.0"

// Parse amounts for contract calls
parseUSDT("1.5"); // 1500000n
parseRupiah("100000"); // 100000000000000000000n
Environment Variables
Required environment variables:
env# Backend API (required)
VITE_PUBLIC_BACKEND_URL=http://localhost:8888/api/v1
VITE_PUBLIC_WEBSOCKET_URL=ws://localhost:8888

# Reown AppKit (required for wallet connection)
VITE_PUBLIC_REOWN_PROJECT_ID=your-project-id

# Smart Contracts (optional, defaults provided)
VITE_PUBLIC_ORACLE_HUB_ADDRESS=0x...
VITE_PUBLIC_QR_PAYMENT_ADDRESS=0x...
VITE_PUBLIC_USDT_ADDRESS=0x...
VITE_PUBLIC_REGISTRY_ADDRESS=0x...
Build & Deploy
Build for Production
bashnpm run build
Output will be in dist/ directory.
Preview Production Build
bashnpm run preview
Lint Code
bashnpm run lint
Responsive Design
The application is fully responsive with mobile-first approach:

Mobile: < 768px
Tablet: 768px - 1024px
Desktop: > 1024px

Special handling for mobile:

Collapsible sidebar
Touch-optimized inputs
Virtual keyboard management
Mobile viewport utilities

Browser Support

Chrome/Edge (latest 2 versions)
Firefox (latest 2 versions)
Safari (latest 2 versions)
Mobile browsers (iOS Safari, Chrome Mobile)

Known Issues & Limitations

Speech Recognition: Only works in HTTPS context (except localhost)
Wallet Connection: Requires MetaMask or WalletConnect-compatible wallet
Mobile Safari: Some CSS variables may need fallbacks for older versions
WebSocket: Ensure backend WebSocket server is accessible from frontend origin

Development Guidelines
Adding New Components

Place in appropriate directory (components/dashboard, components/shared, etc.)
Use TypeScript for type safety
Follow shadcn/ui patterns for UI components
Add proper prop types and documentation

Adding New Routes

Create page component in src/pages/
Add lazy-loaded export in src/routers/pages.tsx
Define route in src/routers/router.tsx

Adding New API Endpoints

Create endpoint function in src/api/
Use the centralized api instance from src/api/api.ts
Define TypeScript types in src/lib/types/

Smart Contract Integration

Add ABI to src/utils/abi.ts
Create hooks in src/utils/contract.ts
Use wagmi's useReadContract and useWriteContract

Performance Optimization

Code splitting via lazy loading
Memoized callbacks and context values
Debounced search inputs
Optimized re-renders with React.memo where appropriate
Image optimization (use WebP when possible)

Security Considerations

JWT tokens stored in localStorage (consider httpOnly cookies for production)
All API requests use HTTPS in production
CORS configured on backend
Input sanitization on user-generated content
Wallet signature verification on backend

Troubleshooting
Wallet Connection Issues

Ensure Reown Project ID is configured
Check browser console for connection errors
Try clearing browser cache and reconnecting

WebSocket Connection Fails

Verify backend WebSocket server is running
Check CORS settings on backend
Ensure WebSocket URL in .env is correct

Smart Contract Calls Fail

Verify wallet is connected to correct network (Sepolia)
Check if user has sufficient ETH for gas
Ensure contract addresses are correct