Backend API Documentation
Overview
This is the backend service for a business assistant application that provides AI-powered chat functionality, user authentication, transaction management, and blockchain settlement features. The application is built with Node.js, Express, TypeScript, and integrates with OpenAI for conversational AI capabilities.
Tech Stack

Runtime: Node.js
Framework: Express.js 5.x
Language: TypeScript
Database: PostgreSQL with Prisma ORM
Real-time Communication: Socket.IO
AI Integration: OpenAI API
Blockchain: Viem (Ethereum interaction)
Authentication: JWT

Prerequisites

Node.js (v14 or higher)
PostgreSQL database
OpenAI API key
Ethereum RPC endpoint (for blockchain features)

Installation

Clone the repository and navigate to the backend directory:

bashcd backend

Install dependencies:

bashnpm install

Set up environment variables by creating a .env file in the backend root directory:

env# Server Configuration
PORT=8000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
DIRECT_URL="postgresql://user:password@localhost:5432/dbname"

# Authentication
JWT_SECRET="your-jwt-secret-key"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# Blockchain Configuration
RPC_URL="http://localhost:8545"
CONTRACT_OWNER_PRIVATE_KEY="your-private-key"
QR_PAYMENT_ADDRESS="0x..."
CHAIN_ID=31337

Run Prisma migrations:

bashnpx prisma migrate dev

Generate Prisma Client:

bashnpx prisma generate
Running the Application
Development Mode
bashnpm run dev
The server will start with hot-reload enabled using nodemon.
Production Mode
bashnpm run build
npm start
```

## Project Structure
```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── controllers/           # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── chat.controller.ts
│   │   ├── settlement.controller.ts
│   │   └── tx.controller.ts
│   ├── lib/
│   │   └── jwt.ts            # JWT authentication middleware
│   ├── openai/               # OpenAI integration
│   │   ├── chat.ts
│   │   ├── createAssistant.ts
│   │   ├── createThread.ts
│   │   └── tools/
│   ├── routers/              # API route definitions
│   │   ├── auth.router.ts
│   │   ├── chat.router.ts
│   │   ├── settlement.router.ts
│   │   └── tx.router.ts
│   ├── services/             # Business logic
│   │   ├── auth/
│   │   ├── chat/
│   │   ├── settlement/
│   │   └── transaction/
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   │   ├── config.ts
│   │   └── prompt.ts
│   ├── app.ts                # Express app configuration
│   ├── index.ts              # Application entry point
│   └── prisma.ts             # Prisma client instance
├── .gitignore
├── package.json
└── tsconfig.json
API Endpoints
Authentication
POST /api/v1/auth/me
Authenticate user and get/create user profile.
Request Body:
json{
  "publicKey": "0x..."
}
Response:
json{
  "id": "uuid",
  "publicKey": "0x...",
  "token": "jwt-token"
}
```

### Chat Management

#### GET /api/v1/chat
Get user's chat history with pagination.

**Headers:**
```
Authorization: Bearer <token>
Query Parameters:

take (optional, default: 10): Number of items per page
page (optional, default: 1): Page number
sortBy (optional, default: "title"): Sort field
sortOrder (optional, default: "asc"): Sort direction
search (optional): Search query

Response:
json{
  "data": [
    {
      "id": "uuid",
      "title": "Chat Title",
      "openaiThreadId": "thread_...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "take": 10,
    "total": 50
  }
}
```

### Transaction Management

#### GET /api/v1/tx
Get user's transactions with pagination.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `take` (optional, default: 10): Number of items per page
- `page` (optional, default: 1): Page number
- `sortBy` (optional, default: "createdAt"): Sort field
- `sortOrder` (optional, default: "desc"): Sort direction
- `search` (optional): Search by transaction hash

#### POST /api/v1/tx
Create a new transaction.

**Headers:**
```
Authorization: Bearer <token>
Request Body:
json{
  "amount": 1000,
  "type": "NATIVE"
}
Response:
json{
  "id": "uuid",
  "userId": "uuid",
  "amount": 1000,
  "type": "NATIVE",
  "status": "PENDING",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### PUT /api/v1/tx/:txId
Update transaction status and hash.

**Headers:**
```
Authorization: Bearer <token>
Request Body:
json{
  "status": "SUCCESS",
  "txHash": "0x..."
}
```

### Settlement

#### POST /api/v1/settlement/settle
Settle a QR payment order on blockchain.

**Headers:**
```
Authorization: Bearer <token>
Request Body:
json{
  "beneficiary": "0x...",
  "orderHash": "0x..."
}
Response:
json{
  "success": true,
  "txHash": "0x...",
  "message": "Order settled successfully"
}
Health Check
GET /health
Check server health status.
Response:
json{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "uptime": 3600.5,
  "memoryUsage": {
    "rss": 50000000,
    "heapTotal": 20000000,
    "heapUsed": 15000000,
    "external": 1000000
  },
  "cpuUsage": {
    "user": 500000,
    "system": 100000
  }
}
WebSocket Events
The application uses Socket.IO for real-time chat functionality.
Client to Server Events
message
Send a message to the AI assistant.
Payload:
json{
  "question": "User's question",
  "userId": "uuid",
  "chatId": "uuid (optional, for continuing existing chat)"
}
Server to Client Events
chat_title
Emitted when a new chat is created with generated title.
Payload:
json"Generated Chat Title"
chat_id
Emitted when a new chat is created with chat ID.
Payload:
json"uuid"
bot_chunk
Emitted during streaming response with message chunks.
Payload:
json{
  "content": [
    {
      "text": {
        "value": "chunk of text"
      }
    }
  ]
}
bot_end
Emitted when AI response is complete.
Payload:
json{
  "chatId": "uuid",
  "isNewChat": true,
  "message": "Response completed"
}
bot_error
Emitted when an error occurs.
Payload:
json"Error message"
Database Schema
User

id: UUID (primary key)
publicKey: Unique wallet address
role: USER or MERCHANT
createdAt: Timestamp
updatedAt: Timestamp

Chat

id: UUID (primary key)
userId: Foreign key to User
title: Chat title
openaiThreadId: Unique OpenAI thread identifier
createdAt: Timestamp
updatedAt: Timestamp

Message

id: UUID (primary key)
chatId: Foreign key to Chat
role: "user" or "assistant"
content: Message text
createdAt: Timestamp

Transaction

id: UUID (primary key)
userId: Foreign key to User
amount: Integer (in smallest unit)
type: NATIVE or USDT
status: PENDING, SUCCESS, or FAILED
txHash: Blockchain transaction hash (optional)
createdAt: Timestamp

Development Scripts

npm run dev: Start development server with hot-reload
npm run build: Compile TypeScript to JavaScript
npm start: Build and start production server
npx prisma studio: Open Prisma Studio for database management
npx prisma migrate dev: Create and apply new migrations
npx prisma generate: Generate Prisma Client

Error Handling
All API endpoints return standardized error responses:
json{
  "message": "Error description"
}
HTTP status codes:

200: Success
400: Bad Request
401: Unauthorized (missing token)
403: Forbidden (invalid/expired token)
500: Internal Server Error

Security Considerations

JWT tokens expire after 1 hour
Private keys should never be committed to version control
Use environment variables for all sensitive configuration
CORS is enabled for all origins in development (restrict in production)
Database credentials should be kept secure

OpenAI Assistant Configuration
The AI assistant is configured with:

Model: GPT-4o
Name: Ellara
Custom instructions for Indonesian business assistant
Extensible tool system for function calling

The assistant prompt is defined in src/utils/prompt.ts and can be customized for specific business needs.
Blockchain Integration
The settlement service uses Viem for Ethereum blockchain interaction:

Supports custom chain configurations
Handles contract interactions for QR payment settlement
Requires private key with sufficient gas for transactions
Contract owner must have appropriate permissions