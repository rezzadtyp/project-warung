# 🚀 UMKM QR Payment - Deployment Guide untuk Mainnet EVM

## 📋 Daftar Isi
1. [Persiapan](#persiapan)
2. [Deployment dengan Hardhat](#deployment-dengan-hardhat)
3. [Deployment dengan Remix](#deployment-dengan-remix)
4. [Verifikasi Contract](#verifikasi-contract)
5. [Setup & Konfigurasi](#setup--konfigurasi)

---

## ⚙️ Persiapan

### 1. Pilih Network Mainnet EVM

**Polygon Mainnet** (Direkomendasikan untuk biaya rendah)
- Network: Polygon PoS
- Chain ID: 137
- RPC: https://polygon-rpc.com
- Explorer: https://polygonscan.com
- Gas Token: MATIC

**BNB Smart Chain** (Alternative)
- Network: BSC Mainnet
- Chain ID: 56
- RPC: https://bsc-dataseed.binance.org
- Explorer: https://bscscan.com
- Gas Token: BNB

**Ethereum Mainnet** (Biaya tinggi, tidak direkomendasikan)
- Network: Ethereum
- Chain ID: 1
- RPC: https://eth.llamarpc.com
- Explorer: https://etherscan.io
- Gas Token: ETH

### 2. Persiapan Wallet

✅ **Checklist:**
- [ ] Private key wallet yang aman (jangan pernah share!)
- [ ] Gas token yang cukup (estimasi: 0.5 MATIC atau 0.01 BNB)
- [ ] Address USDT di network yang dipilih
- [ ] API Key dari explorer (untuk verifikasi contract)

### 3. Environment Setup

Anda perlu:
- Node.js v16 atau lebih tinggi
- npm atau yarn
- Code editor (VS Code recommended)

---

## 🔧 Deployment dengan Hardhat (Recommended)

### Step 1: Initialize Project

```bash
mkdir umkm-deployment
cd umkm-deployment
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install dotenv
npx hardhat init
```

Pilih: **Create a JavaScript project**

### Step 2: Setup Environment Variables

Buat file `.env`:

```env
# Network Configuration
PRIVATE_KEY=your_private_key_here
POLYGON_RPC=https://polygon-rpc.com
BSC_RPC=https://bsc-dataseed.binance.org

# Explorer API Keys (untuk verifikasi)
POLYGONSCAN_API_KEY=your_polygonscan_api_key
BSCSCAN_API_KEY=your_bscscan_api_key

# Token Addresses
USDT_ADDRESS_POLYGON=0xc2132D05D31c914a87C6611C10748AEb04B58e8F
USDT_ADDRESS_BSC=0x55d398326f99059fF775485246999027B3197955
```

### Step 3: Configure Hardhat

Edit `hardhat.config.js`:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    polygon: {
      url: process.env.POLYGON_RPC,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 137
    },
    bsc: {
      url: process.env.BSC_RPC,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 56
    }
  },
  etherscan: {
    apiKey: {
      polygon: process.env.POLYGONSCAN_API_KEY,
      bsc: process.env.BSCSCAN_API_KEY
    }
  }
};
```

### Step 4: Buat Deployment Script

Saya sudah siapkan script deployment lengkap (lihat file `deploy.js`)

### Step 5: Deploy ke Mainnet

```bash
# Deploy ke Polygon
npx hardhat run scripts/deploy.js --network polygon

# Deploy ke BSC
npx hardhat run scripts/deploy.js --network bsc
```

### Step 6: Verifikasi Contract

```bash
# Setelah deploy, catat contract addresses, lalu:
npx hardhat verify --network polygon ORACLE_HUB_ADDRESS
npx hardhat verify --network polygon PAYMENT_CONTRACT_ADDRESS "ORACLE_HUB_ADDRESS"
npx hardhat verify --network polygon REGISTRY_CONTRACT_ADDRESS
```

---

## 🌐 Deployment dengan Remix (Alternatif Mudah)

### Step 1: Prepare Remix

1. Buka https://remix.ethereum.org
2. Buat file baru: `UMKMContracts.sol`
3. Copy paste smart contract Anda

### Step 2: Compile

1. Pergi ke tab "Solidity Compiler"
2. Pilih compiler version: **0.8.20**
3. Enable Optimization: **200 runs**
4. Klik **Compile**

### Step 3: Connect Wallet

1. Pergi ke tab "Deploy & Run Transactions"
2. Environment: Pilih **Injected Provider - MetaMask**
3. Pastikan MetaMask sudah connect ke network yang benar
4. Pastikan wallet Anda punya gas token

### Step 4: Deploy Step by Step

**4.1. Deploy SimpleOracleHub**
- Contract: Pilih `SimpleOracleHub`
- Klik **Deploy**
- Tunggu konfirmasi
- **CATAT ADDRESS** SimpleOracleHub

**4.2. Setup Oracle Rate**
- Gunakan fungsi `updateRate`
- Parameter:
  - `_token`: Address USDT (lihat table di bawah)
  - `_newRate`: `15800000000000000000000` (untuk 1 USDT = 15,800 IDR)
- Klik **transact**

**4.3. Deploy UMKMQRPayment**
- Contract: Pilih `UMKMQRPayment`
- Constructor parameter:
  - `_oracleHubAddress`: Address SimpleOracleHub dari step 4.1
- Klik **Deploy**
- **CATAT ADDRESS** UMKMQRPayment

**4.4. Deploy UMKMRegistry**
- Contract: Pilih `UMKMRegistry`
- Klik **Deploy**
- **CATAT ADDRESS** UMKMRegistry

### Token Addresses per Network

| Network | USDT Address |
|---------|--------------|
| Polygon | `0xc2132D05D31c914a87C6611C10748AEb04B58e8F` |
| BSC | `0x55d398326f99059fF775485246999027B3197955` |
| Ethereum | `0xdAC17F958D2ee523a2206206994597C13D831ec7` |

---

## ✅ Verifikasi Contract

### Menggunakan Explorer GUI

1. **Polygon:** Kunjungi https://polygonscan.com/verifyContract
2. **BSC:** Kunjungi https://bscscan.com/verifyContract

**Form verifikasi:**
- Compiler Type: Solidity (Single file)
- Compiler Version: v0.8.20+commit.a1b79de6
- Open Source License Type: MIT
- Optimization: Yes, 200 runs
- Paste source code
- Submit

### Menggunakan Hardhat

Sudah dijelaskan di section Hardhat di atas.

---

## 🔧 Setup & Konfigurasi

### 1. Set Oracle Rate (Wajib!)

Setelah deploy, Anda harus set exchange rate:

```javascript
// Via ethers.js
const oracleHub = await ethers.getContractAt("SimpleOracleHub", ORACLE_ADDRESS);

// Set rate untuk USDT: 1 USDT = 15,800 IDR
await oracleHub.updateRate(
  USDT_ADDRESS,
  ethers.parseUnits("15800", 18)
);

// Set rate untuk native token jika diperlukan: 1 MATIC = 15,000 IDR
await oracleHub.updateRate(
  "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  ethers.parseUnits("15000", 18)
);
```

### 2. Setup Friendly Bot

Backend bot Anda harus di-whitelist:

```javascript
const payment = await ethers.getContractAt("UMKMQRPayment", PAYMENT_ADDRESS);

await payment.changeBotStatus(BOT_WALLET_ADDRESS, true);
```

### 3. Testing di Mainnet

**⚠️ PENTING: Test dengan jumlah kecil dulu!**

```javascript
// Test approval USDT
const usdt = await ethers.getContractAt("IERC20", USDT_ADDRESS);
await usdt.approve(PAYMENT_ADDRESS, ethers.parseUnits("1", 6)); // Approve 1 USDT

// Test payment
const payment = await ethers.getContractAt("UMKMQRPayment", PAYMENT_ADDRESS);
await payment.payQR(
  USDT_ADDRESS,
  ethers.parseUnits("15800", 18), // 15,800 IDR
  "TEST001",
  "test-reference"
);
```

---

## 🎯 Deployment Checklist

### Pre-Deployment
- [ ] Code sudah di-audit atau review
- [ ] Test di testnet (Mumbai/BSC Testnet)
- [ ] Wallet punya gas token cukup
- [ ] Private key aman dan di-backup
- [ ] Environment variables sudah di-set

### During Deployment
- [ ] Deploy SimpleOracleHub
- [ ] Set initial oracle rates
- [ ] Deploy UMKMQRPayment dengan Oracle address
- [ ] Deploy UMKMRegistry
- [ ] Setup friendly bot addresses
- [ ] Verify semua contracts

### Post-Deployment
- [ ] Test transaction dengan amount kecil
- [ ] Catat semua contract addresses
- [ ] Setup monitoring & alerts
- [ ] Update frontend dengan contract addresses
- [ ] Dokumentasi untuk tim

---

## 💰 Estimasi Biaya Gas

| Network | Oracle | Payment | Registry | Total | USD Est. |
|---------|--------|---------|----------|-------|----------|
| Polygon | ~0.1 MATIC | ~0.2 MATIC | ~0.15 MATIC | ~0.45 MATIC | ~$0.30 |
| BSC | ~0.002 BNB | ~0.004 BNB | ~0.003 BNB | ~0.009 BNB | ~$2.70 |
| Ethereum | ~0.01 ETH | ~0.02 ETH | ~0.015 ETH | ~0.045 ETH | ~$135 |

**Rekomendasi: Gunakan Polygon untuk biaya termurah**

---

## 🆘 Troubleshooting

### Gas Price Terlalu Tinggi
- Tunggu network tidak sibuk
- Gunakan gas price estimator
- Set manual gas limit jika perlu

### Transaction Gagal
- Cek balance gas token
- Cek allowance untuk USDT
- Pastikan parameter benar
- Cek error message di explorer

### Contract Tidak Bisa Verified
- Pastikan exact same source code
- Cek compiler version & optimization settings
- Flatten contract jika ada imports
- Gunakan constructor arguments yang sama

---

## 📞 Support

Jika ada masalah:
1. Cek transaction hash di explorer
2. Baca error message dengan teliti
3. Review deployment logs
4. Pastikan semua prerequisites terpenuhi

---

## ⚠️ Security Reminders

- **JANGAN** share private key
- **JANGAN** commit .env file
- **SELALU** test di testnet dulu
- **GUNAKAN** multi-sig wallet untuk production
- **SETUP** monitoring dan alerts
- **BACKUP** semua credentials

---

**Good luck dengan deployment! 🚀**