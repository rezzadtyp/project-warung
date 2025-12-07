# Backend API Documentation

## Overview

This is the backend service for a business assistant application that provides:
- **AI-Powered Chatbot** with real-time streaming responses via WebSocket
- **Blockchain Settlement Service** for QR payment order settlement
- **Transaction Management** for tracking payment transactions
- **User Authentication** via wallet-based JWT tokens
- **Database Management** with PostgreSQL and Prisma ORM

The backend acts as the central hub connecting the frontend application with OpenAI's AI services, blockchain networks, and the database.

---

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js 5.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL with Prisma ORM
- **Real-time Communication**: Socket.IO 4.8.1
- **AI Integration**: OpenAI API (GPT-4o)
- **Blockchain**: Viem 2.x (Ethereum interaction)
- **Authentication**: JWT (jsonwebtoken)
- **HTTP Client**: Built-in fetch/axios

---

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (v12+)
- OpenAI API key
- Ethereum RPC endpoint (Sepolia testnet)
- Contract owner private key (for settlement)
- npm or yarn package manager

---

## Installation

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**

Create a `.env` file in the backend root directory:

```env
# Server Configuration
PORT=8888

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
DIRECT_URL="postgresql://user:password@localhost:5432/dbname"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# OpenAI
OPENAI_API_KEY="sk-your-openai-api-key"

# Blockchain Configuration (Sepolia Testnet)
RPC_URL="https://1rpc.io/sepolia"
CONTRACT_OWNER_PRIVATE_KEY="0x-your-contract-owner-private-key"
QR_PAYMENT_ADDRESS="0x30B25eEd981bcc3E25eF0fEAF0D67D6ECD7FeDec"
CHAIN_ID=11155111
```

4. **Set up database:**

```bash
# Run Prisma migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate
```

5. **Start the server:**

```bash
# Development mode (with hot-reload)
npm run dev

# Production mode
npm run build
npm start
```

The server will start on `http://localhost:8888` (or the PORT specified in .env).

---

## Core Features

### 1. 🤖 AI Chatbot (WebSocket-based)

**Purpose**: Real-time AI-powered chatbot that provides business assistance, product information, and customer support.

#### Flow:

1. **Client Connection**
   - Client connects to WebSocket server via Socket.IO
   - Connection established on `/` namespace
   - Server listens for `message` events

2. **Message Reception**
   - Client sends message event with:
     ```json
     {
       "question": "User's question",
       "userId": "user-uuid",
       "chatId": "chat-uuid (optional)"
     }
     ```
   - Server validates message format
   - Checks if `question` and `userId` are provided

3. **Chat/Thread Management**
   - If `chatId` provided:
     - Server looks up existing chat in database
     - Retrieves OpenAI thread ID from chat record
     - Uses existing thread for conversation continuity
   - If no `chatId`:
     - Creates new OpenAI thread
     - Generates chat title from first message
     - Creates new chat record in database
     - Emits `chat_title` and `chat_id` events to client

4. **OpenAI Assistant Setup**
   - Server creates/retrieves OpenAI Assistant (named "Ellara")
   - Assistant configured with:
     - Model: GPT-4o
     - Custom instructions for Indonesian business assistant
     - Extensible tool system for function calling

5. **Message Processing**
   - User message added to OpenAI thread
   - Message saved to database (if chat exists)
   - Assistant run is initiated with streaming enabled

6. **Streaming Response**
   - Server streams response chunks in real-time
   - For each chunk:
     - Emits `bot_chunk` event with delta content
     - Client receives and displays text incrementally
   - Response text is accumulated server-side

7. **Response Completion**
   - When stream ends:
     - Complete response saved to database
     - `bot_end` event emitted with chat info
     - Client can update UI accordingly

8. **Error Handling**
   - If error occurs:
     - `bot_error` event emitted with error message
     - Client displays error to user
     - Connection remains open for retry

#### Technical Details:

- **Component**: `src/openai/chat.ts`
- **WebSocket**: Socket.IO with CORS enabled
- **AI Model**: OpenAI GPT-4o
- **Streaming**: Real-time delta streaming
- **Thread Management**: OpenAI Threads API
- **Database**: Chat and Message records persisted

#### WebSocket Events:

**Client → Server:**
```typescript
socket.emit("message", {
  question: "Hello, I need help",
  userId: "user-uuid",
  chatId: "chat-uuid" // optional
});
```

**Server → Client:**
```typescript
// New chat created
socket.on("chat_title", (title: string) => { ... });
socket.on("chat_id", (chatId: string) => { ... });

// Streaming response
socket.on("bot_chunk", (data: MessageDeltaEvent) => { ... });

// Response complete
socket.on("bot_end", (data: { chatId, isNewChat, message }) => { ... });

// Error occurred
socket.on("bot_error", (error: string) => { ... });
```

#### Chat Title Generation:

When a new chat is created, the system automatically generates a title:
- Uses OpenAI to analyze the first user message
- Generates a concise, descriptive title
- Saves title to database
- Emits title to client for display

---

### 2. 💰 Settlement Service (Blockchain Integration)

**Purpose**: Allows merchants to settle QR payment orders and withdraw funds from the smart contract.

#### Flow:

1. **API Request**
   - Merchant sends POST request to `/api/v1/settlement/settle`
   - Request includes:
     ```json
     {
       "beneficiary": "0xMerchantWalletAddress",
       "orderHash": "0xOrderHashFromFrontend"
     }
     ```
   - Request authenticated with JWT token

2. **Request Validation**
   - Controller validates request body
   - Checks if `beneficiary` and `orderHash` are provided
   - Returns 400 error if validation fails

3. **Service Processing**
   - Service checks environment variables:
     - `CONTRACT_OWNER_PRIVATE_KEY` must be set
     - `QR_PAYMENT_ADDRESS` must be set
   - Creates wallet client using contract owner's private key
   - Configures Sepolia network (chain ID: 11155111)

4. **Blockchain Transaction**
   - Wallet client calls `settleQROrder()` on smart contract:
     ```solidity
     settleQROrder(
       address _beneficiary,    // Merchant wallet address
       bytes32 _orderDataHash   // Order hash
     )
     ```
   - Transaction is signed with contract owner's private key
   - Transaction sent to Sepolia network via RPC

5. **Response**
   - On success: Returns transaction hash
     ```json
     {
       "success": true,
       "txHash": "0x...",
       "message": "Order settled successfully"
     }
     ```
   - On error: Throws error with descriptive message

#### Technical Details:

- **Component**: `src/services/settlement/settle-order.service.ts`
- **Blockchain Library**: Viem 2.x
- **Network**: Sepolia testnet (always)
- **RPC Endpoint**: Configurable via `RPC_URL` env var
- **Timeout**: 60 seconds for RPC calls
- **Contract Function**: `settleQROrder(address, bytes32)`

#### Security:

- **Private Key**: Stored in environment variables (never in code)
- **Authentication**: JWT token required for API access
- **Authorization**: Only contract owner can settle orders
- **Network**: Always uses Sepolia (hardcoded)

#### Error Handling:

- Missing environment variables
- Invalid RPC endpoint
- Insufficient gas
- Contract revert errors
- Network timeouts

#### Usage Example:

```typescript
// Frontend calls backend API
const response = await fetch('/api/v1/settlement/settle', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    beneficiary: '0x...',
    orderHash: '0x...'
  })
});

const result = await response.json();
// { success: true, txHash: '0x...', message: '...' }
```

---

### 3. 📊 Transaction Management

**Purpose**: Track and manage payment transactions for users.

#### Features:

- **Create Transactions**: Record new payment transactions
- **List Transactions**: Get paginated transaction history
- **Update Transactions**: Update transaction status and hash
- **Search Transactions**: Search by transaction hash

#### API Endpoints:

##### GET /api/v1/tx
Get user's transactions with pagination.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `take` (optional, default: 10): Number of items per page
- `page` (optional, default: 1): Page number
- `sortBy` (optional, default: "createdAt"): Sort field
- `sortOrder` (optional, default: "desc"): Sort direction ("asc" | "desc")
- `search` (optional): Search by transaction hash

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "amount": 100000,
      "type": "USDT",
      "status": "SUCCESS",
      "txHash": "0x...",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "take": 10,
    "total": 50
  }
}
```

##### POST /api/v1/tx
Create a new transaction record.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 100000,
  "type": "USDT"
}
```

**Response:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "amount": 100000,
  "type": "USDT",
  "status": "PENDING",
  "txHash": null,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

##### PUT /api/v1/tx/:txId
Update transaction status and blockchain hash.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "SUCCESS",
  "txHash": "0x..."
}
```

**Response:**
```json
{
  "status": "OK",
  "message": "Transaction updated successfully"
}
```

#### Transaction Types:

- `NATIVE`: Native blockchain token (ETH, MATIC, etc.)
- `USDT`: USDT token payments

#### Transaction Statuses:

- `PENDING`: Transaction created but not confirmed
- `SUCCESS`: Transaction confirmed on blockchain
- `FAILED`: Transaction failed or reverted

---

### 4. 🔐 Authentication

**Purpose**: Wallet-based authentication using JWT tokens.

#### Flow:

1. **User Authentication Request**
   - Client sends POST request to `/api/v1/auth/me`
   - Request includes wallet address:
     ```json
     {
       "publicKey": "0xWalletAddress"
     }
     ```

2. **User Lookup/Creation**
   - Server looks up user by `publicKey` in database
   - If user exists: Retrieve user record
   - If user doesn't exist: Create new user record
   - Default role: `USER` (can be changed to `MERCHANT`)

3. **JWT Token Generation**
   - Server generates JWT token with:
     - User ID
     - Expiration: 1 hour
   - Token signed with `JWT_SECRET`

4. **Response**
   - Returns user data and token:
     ```json
     {
       "id": "user-uuid",
       "publicKey": "0x...",
       "token": "jwt-token-string"
     }
     ```

5. **Token Usage**
   - Client stores token in localStorage
   - Token included in Authorization header for protected routes:
     ```
     Authorization: Bearer <token>
     ```

#### JWT Middleware:

All protected routes use `verifyToken` middleware:
- Extracts token from `Authorization` header
- Verifies token signature and expiration
- Attaches user info to `req.user`
- Returns 401/403 if token invalid/expired

#### Protected Routes:

- `/api/v1/chat/*` - Chat management
- `/api/v1/tx/*` - Transaction management
- `/api/v1/settlement/*` - Settlement operations

---

## API Endpoints

### Authentication

#### POST /api/v1/auth/me
Authenticate user and get/create user profile.

**Request Body:**
```json
{
  "publicKey": "0x..."
}
```

**Response:**
```json
{
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
```

**Query Parameters:**
- `take` (optional, default: 10): Number of items per page
- `page` (optional, default: 1): Page number
- `sortBy` (optional, default: "title"): Sort field
- `sortOrder` (optional, default: "asc"): Sort direction
- `search` (optional): Search query

**Response:**
```json
{
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

See [Transaction Management](#3-transaction-management) section above.

### Settlement

#### POST /api/v1/settlement/settle
Settle a QR payment order on blockchain.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "beneficiary": "0x...",
  "orderHash": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "txHash": "0x...",
  "message": "Order settled successfully"
}
```

### Health Check

#### GET /health
Check server health status.

**Response:**
```json
{
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
```

---

## WebSocket Events

The application uses Socket.IO for real-time chat functionality.

### Client to Server Events

#### `message`
Send a message to the AI assistant.

**Payload:**
```json
{
  "question": "User's question",
  "userId": "uuid",
  "chatId": "uuid (optional, for continuing existing chat)"
}
```

### Server to Client Events

#### `chat_title`
Emitted when a new chat is created with generated title.

**Payload:**
```json
"Generated Chat Title"
```

#### `chat_id`
Emitted when a new chat is created with chat ID.

**Payload:**
```json
"uuid"
```

#### `bot_chunk`
Emitted during streaming response with message chunks.

**Payload:**
```json
{
  "content": [
    {
      "text": {
        "value": "chunk of text"
      }
    }
  ]
}
```

#### `bot_end`
Emitted when AI response is complete.

**Payload:**
```json
{
  "chatId": "uuid",
  "isNewChat": true,
  "message": "Response completed"
}
```

#### `bot_error`
Emitted when an error occurs.

**Payload:**
```json
"Error message"
```

---

## Database Schema

### User

Stores user/merchant information.

```prisma
model User {
  id           String        @id @default(uuid())
  publicKey    String        @unique
  role         UserRole      @default(USER)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  chats        Chat[]
  transactions Transaction[]
}
```

**Fields:**
- `id`: UUID primary key
- `publicKey`: Unique wallet address (indexed)
- `role`: USER or MERCHANT
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Chat

Stores chat conversation threads.

```prisma
model Chat {
  id             String   @id @default(uuid())
  userId         String
  title          String
  openaiThreadId String   @unique
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  user           User     @relation(fields: [userId], references: [id])
  messages       Message[]
}
```

**Fields:**
- `id`: UUID primary key
- `userId`: Foreign key to User
- `title`: Chat title (auto-generated)
- `openaiThreadId`: Unique OpenAI thread identifier
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Message

Stores individual messages in chats.

```prisma
model Message {
  id        String   @id @default(uuid())
  chatId    String
  role      String   // 'user' or 'assistant'
  content   String
  createdAt DateTime @default(now())
  chat      Chat     @relation(fields: [chatId], references: [id])
}
```

**Fields:**
- `id`: UUID primary key
- `chatId`: Foreign key to Chat
- `role`: "user" or "assistant"
- `content`: Message text
- `createdAt`: Timestamp

### Transaction

Stores payment transaction records.

```prisma
model Transaction {
  id        String            @id @default(uuid())
  userId    String
  amount    Int
  type      TransactionType   @default(NATIVE)
  status    TransactionStatus @default(PENDING)
  txHash    String?           @unique
  createdAt DateTime          @default(now())
  user      User              @relation(fields: [userId], references: [id])
}
```

**Fields:**
- `id`: UUID primary key
- `userId`: Foreign key to User
- `amount`: Integer (in smallest unit, e.g., cents or wei)
- `type`: NATIVE or USDT
- `status`: PENDING, SUCCESS, or FAILED
- `txHash`: Blockchain transaction hash (optional, unique)
- `createdAt`: Timestamp

---

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema definition
├── src/
│   ├── controllers/           # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── chat.controller.ts
│   │   ├── settlement.controller.ts
│   │   └── tx.controller.ts
│   ├── lib/
│   │   └── jwt.ts            # JWT authentication middleware
│   ├── openai/               # OpenAI integration
│   │   ├── chat.ts           # Chat streaming logic
│   │   ├── createAssistant.ts # Assistant creation
│   │   ├── createThread.ts   # Thread creation
│   │   └── tools/            # Function calling tools
│   ├── routers/              # API route definitions
│   │   ├── auth.router.ts
│   │   ├── chat.router.ts
│   │   ├── settlement.router.ts
│   │   └── tx.router.ts
│   ├── services/             # Business logic
│   │   ├── auth/
│   │   │   └── me.ts         # Authentication service
│   │   ├── chat/
│   │   │   └── get-chats.service.ts
│   │   ├── chat.ts           # Chat service
│   │   ├── settlement/
│   │   │   └── settle-order.service.ts
│   │   └── transaction/
│   │       ├── create-tx.service.ts
│   │       ├── get-txs.service.ts
│   │       └── update-tx.service.ts
│   ├── types/                # TypeScript type definitions
│   │   └── pagination.type.ts
│   ├── utils/                # Utility functions
│   │   ├── config.ts         # Environment configuration
│   │   └── prompt.ts         # AI assistant prompt
│   ├── app.ts                # Express app configuration
│   ├── index.ts              # Application entry point
│   └── prisma.ts             # Prisma client instance
├── .env                      # Environment variables
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## Development Scripts

- `npm run dev`: Start development server with hot-reload (nodemon)
- `npm run build`: Compile TypeScript to JavaScript
- `npm start`: Build and start production server
- `npx prisma studio`: Open Prisma Studio for database management
- `npx prisma migrate dev`: Create and apply new migrations
- `npx prisma generate`: Generate Prisma Client
- `npx prisma migrate reset`: Reset database (development only)

---

## Error Handling

All API endpoints return standardized error responses:

```json
{
  "message": "Error description"
}
```

### HTTP Status Codes:

- `200`: Success
- `400`: Bad Request (validation errors, missing parameters)
- `401`: Unauthorized (missing token)
- `403`: Forbidden (invalid/expired token)
- `500`: Internal Server Error

### Error Middleware:

Global error handling middleware catches all errors and returns appropriate status codes:

```typescript
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  res.status(400).send({ message: err.message });
});
```

---

## Security Considerations

### Authentication & Authorization

- **JWT Tokens**: Expire after 1 hour
- **Token Storage**: Client-side (localStorage)
- **Token Validation**: Signature and expiration checked on every request
- **Protected Routes**: All routes except `/health` and `/api/v1/auth/me` require authentication

### Environment Variables

- **Private Keys**: Never commit to version control
- **API Keys**: Store in `.env` file (not in code)
- **Database Credentials**: Keep secure and rotate regularly
- **JWT Secret**: Use strong, random secret in production

### CORS Configuration

- **Development**: CORS enabled for all origins (`*`)
- **Production**: Restrict CORS to specific frontend domains
- **WebSocket**: CORS configured for Socket.IO connections

### Blockchain Security

- **Private Key**: Contract owner's private key stored in environment variables
- **Network**: Always uses Sepolia testnet (hardcoded)
- **Gas Management**: Ensure sufficient ETH for gas fees
- **Error Handling**: Comprehensive error handling for blockchain operations

### Database Security

- **Connection String**: Use secure connection strings
- **SQL Injection**: Prisma ORM prevents SQL injection
- **Migrations**: Run migrations in controlled environment
- **Backups**: Regular database backups recommended

---

## OpenAI Assistant Configuration

The AI assistant is configured with:

- **Model**: GPT-4o
- **Name**: Ellara
- **Instructions**: Custom instructions for Indonesian business assistant
- **Tools**: Extensible tool system for function calling
- **Temperature**: Default (can be configured)

### Assistant Prompt

The assistant prompt is defined in `src/utils/prompt.ts` and can be customized for specific business needs. The prompt includes:

- Business context
- Language preferences (Indonesian/English)
- Response style guidelines
- Tool usage instructions

### Thread Management

- Each chat conversation uses a unique OpenAI thread
- Threads persist across sessions
- Messages are added to threads in order
- Threads can be retrieved and continued

---

## Blockchain Integration

### Settlement Service

The settlement service uses Viem for Ethereum blockchain interaction:

- **Library**: Viem 2.x
- **Network**: Sepolia testnet (chain ID: 11155111)
- **RPC Endpoint**: Configurable via `RPC_URL` environment variable
- **Timeout**: 60 seconds for RPC calls
- **Retry**: Not implemented (can be added)

### Smart Contract Interaction

The service interacts with the `UMKMQRPayment` contract:

```solidity
function settleQROrder(
  address _beneficiary,
  bytes32 _orderDataHash
) external;
```

### Requirements

- **Contract Owner**: Private key must have permission to call `settleQROrder`
- **Gas**: Sufficient ETH for gas fees
- **Network**: Must be connected to Sepolia testnet
- **RPC**: Reliable RPC endpoint (recommended: Infura, Alchemy, QuickNode)

### Error Scenarios

- **Missing Private Key**: Service throws error
- **Invalid RPC**: Connection timeout or error
- **Insufficient Gas**: Transaction fails
- **Contract Revert**: Transaction reverts (order already settled, invalid hash, etc.)
- **Network Issues**: RPC timeout or network errors

---

## Environment Variables

### Required

```env
# Server
PORT=8888

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
DIRECT_URL="postgresql://user:password@localhost:5432/dbname"

# Authentication
JWT_SECRET="your-jwt-secret-key"

# OpenAI
OPENAI_API_KEY="sk-your-openai-api-key"
```

### Optional (with defaults)

```env
# Blockchain (defaults to Sepolia)
RPC_URL="https://1rpc.io/sepolia"
CONTRACT_OWNER_PRIVATE_KEY="0x..."
QR_PAYMENT_ADDRESS="0x30B25eEd981bcc3E25eF0fEAF0D67D6ECD7FeDec"
CHAIN_ID=11155111
```

---

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running
- Check `DATABASE_URL` is correct
- Ensure database exists
- Check network connectivity

### OpenAI API Issues

- Verify `OPENAI_API_KEY` is valid
- Check API quota/limits
- Ensure network can reach OpenAI API
- Check API key permissions

### Blockchain Settlement Fails

- Verify `CONTRACT_OWNER_PRIVATE_KEY` is set
- Check RPC endpoint is accessible
- Ensure sufficient ETH for gas
- Verify contract address is correct
- Check network is Sepolia testnet

### WebSocket Connection Issues

- Verify Socket.IO server is running
- Check CORS configuration
- Ensure WebSocket URL is correct
- Check firewall/network settings

### JWT Token Issues

- Verify `JWT_SECRET` is set
- Check token expiration
- Ensure token format is correct
- Verify token in Authorization header

---

## Performance Optimization

### Database

- Use indexes on frequently queried fields
- Implement pagination for large datasets
- Use connection pooling
- Optimize Prisma queries

### API

- Implement rate limiting
- Use caching where appropriate
- Optimize response payloads
- Use compression middleware

### WebSocket

- Limit concurrent connections
- Implement connection timeouts
- Use room-based messaging for scalability
- Monitor connection health

---

## Monitoring & Logging

### Recommended Monitoring

- **Health Checks**: Use `/health` endpoint
- **Error Tracking**: Implement error tracking service (Sentry, etc.)
- **Performance**: Monitor API response times
- **Database**: Monitor query performance
- **Blockchain**: Monitor transaction success rates

### Logging

- Log all errors with context
- Log important operations (settlements, etc.)
- Use structured logging
- Implement log rotation

---

## Deployment

### Production Checklist

- [ ] Set strong `JWT_SECRET`
- [ ] Use production database
- [ ] Configure CORS for specific domains
- [ ] Set up environment variables securely
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Set up database backups
- [ ] Use reliable RPC provider
- [ ] Secure private keys

### Recommended Hosting

- **Platform**: Vercel, Railway, Render, AWS, etc.
- **Database**: Managed PostgreSQL (AWS RDS, Supabase, etc.)
- **Environment**: Use platform's environment variable management
- **Scaling**: Consider horizontal scaling for WebSocket connections

---

## License

ISC

---

## Support

For issues and questions, please refer to the frontend documentation or contact the development team.
