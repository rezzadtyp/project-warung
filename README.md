# PROJECT WARUNG
Project Warung adalah sebuah project yang menggabungkan konsep simplisitas QRIS dan Web3 sebagai alat untuk mempermudah pembayaran onchain. Dimana project ini fokus pada fitur QR as payment dan juga adanya AI Chatbot untuk membantu Merchant yang masih tidak awam akan teknologi web3 tersebut. Project ini menggunakan USDT sebagai alat utama pembayaran yang mana jumlahnya akan di konversi dari nilai mata uang rupiah di dunia nyata. Katakan merchant perlu generate QR untuk pembayaran sejumlah Rp 50.000, maka customer perlu membayar sebesar kurang lebih 3.1 USDT (asumsi 1 USDT = Rp 15800). Project ini sangat terinpirasi oleh salah satu project ongoing dari Bitkub Thailand yang mana menggunakan QR to USDC payment untuk pembayaran parkir di kota Bangkok.

## FRONTEND
### Tech Stack

- **Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.17
- **UI Components**: Radix UI primitives with shadcn/ui
- **State Management**: React hooks + Context API
- **Routing**: React Router DOM 7.9.6
- **Real-time Communication**: Socket.IO Client 4.8.1
- **Blockchain**:
  - Wagmi 3.0.2
  - Viem 2.40.3
  - Reown AppKit 1.8.14
- **HTTP Client**: Axios 1.13.2
- **Animations**: Framer Motion 12.23.25

---

## BACKEND
### Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: JavaScript/TypeScript
- **Real-time Communication**: Socket.IO Server
- **AI Integration**: OpenAI Chat API
- **HTTP Client**: Axios (untuk komunikasi dengan OpenAI dan exchange rate API)

### Features

#### 1. AI Chatbot Service (Socket.IO)
- Real-time chat menggunakan Socket.IO untuk komunikasi bi-directional
- Integrasi dengan OpenAI Chat Model untuk menjawab pertanyaan merchant tentang Web3 dan crypto
- Context-aware responses untuk membantu merchant memahami teknologi blockchain
- Support untuk multi-session chat handling

#### 2. Payment Settlement API
- **POST** `/api/v1/settlement/settle` - Endpoint untuk settle pembayaran QR
  - Verifikasi transaksi onchain
  - Konversi IDR ke USDT berdasarkan exchange rate real-time
  - Update status pembayaran
  - Return konfirmasi transaksi ke merchant

---

## CARA KERJA SISTEM

1. **Merchant Flow**:
   - Merchant login ke dashboard
   - Input jumlah pembayaran dalam IDR (contoh: Rp 50.000)
   - Sistem otomatis convert ke USDT berdasarkan rate terkini
   - Generate QR code yang berisi payment details
   - Tampilkan QR code ke customer

2. **Customer Flow**:
   - Scan QR code menggunakan Web3 wallet
   - Lihat jumlah USDT yang harus dibayar
   - Confirm dan kirim transaksi onchain
   - Tunggu konfirmasi pembayaran

3. **Settlement Flow**:
   - Backend menerima notifikasi transaksi
   - Verifikasi transaksi di blockchain
   - Update status pembayaran menjadi "completed"
   - Kirim notifikasi ke merchant dashboard via Socket.IO

4. **AI Assistant Flow**:
   - Merchant bertanya tentang Web3/crypto via chatbot
   - Socket.IO mengirim pertanyaan ke backend
   - Backend forward ke OpenAI Chat API
   - Response dikirim kembali real-time ke merchant

---

## INSTALASI

### Prerequisites
- Node.js v18 atau lebih tinggi
- npm atau yarn
- Web3 wallet (MetaMask, WalletConnect, dll)

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
npm install
npm start
```

### EVM Setup (Remix IDE)
  - Buat file baru UMKMQRPayment.sol
  - Deploy smart contract di Remix IDE
  - Mint MockUSDT (testnet)
  - Deploy SimpleOracleHub lalu set Oracle Rate dengan rate IDR ke USD
  - Deploy UMKMQRPayment dengan parameter address SimpleOracleHub
  - Deploy UMKMRegistry (Optional)
  - Wallet 2 (Customer) approve MockUSDT dengan spender address UMKMQRPayment

---

## ROADMAP

- [x] Implementasi QR payment system
- [x] Integrasi OpenAI chatbot
- [x] Socket.IO untuk real-time communication
- [ ] Multi-currency support (USDC, DAI, dll)
- [ ] Dashboard analytics untuk merchant
- [ ] Mobile app development
- [ ] Integration dengan payment gateway lokal

---

## KONTRIBUSI

Project ini masih dalam tahap development. Kontribusi dan feedback sangat diterima!

---

## LICENSE

MIT License