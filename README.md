# Je-Sui — On-Chain Password Manager

**Experimenting with decentralized, walletless credentials storage — powered by Sui, zkLogin, Seal, and Walrus.**

---

##  Project Overview

This project is a **decentralized password manager** built for the Sui Hackathon (DEVMatch 2025). It enables users to manage encrypted credentials without wallets via email-based zkLogin while maintaining full ownership through on-chain enforcement.

**Core Components:**
1. **Authentication Layer** — zkLogin (OAuth → ZKP → Sui Address)
2. **Encryption Layer** — Seal SDK for encryption + capability checks
3. **Storage Layer** — Walrus for encrypted blob storage
4. **On-chain Logic** — Move module for vault & entry management

---

##  Project Status

- [x] GitHub repo ready  
- [x] Frontend scaffold created (Vite + React/TS)  
- [x] Dockerfile for production build and serving compiled  
- [ ] Move contract stubbed (Vault struct, create/update flows)  
- [ ] zkLogin hook and Walrus client logic pending  
- [ ] Seal integration: import, APIs, and Move check logic still testing  
- [ ] Full end-to-end flow yet to be validated  


## 🛠️ Architecture

**System Flow:**

User → zkLogin → Seal Encryption → Walrus Storage → Vault Object on Sui


## 🚀 Getting Started

### 📦 Prerequisites
- **Node.js** v18+
- **Docker** installed
- **Sui CLI** installed (`sui move build`, `sui client publish`)
- Access to **Sui Devnet/Testnet** faucet ([https://faucet.sui.io](https://faucet.sui.io))

---

### 🖥️ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🗺️ Roadmap & Tasks

| Phase             | Description |
|-------------------|-------------|
| **Phase 1 — MVP** | zkLogin login → encrypt with Walrus → `create_vault()` Move call |
| **Phase 2 — Seal**| Integrate Seal for secure capability checks |
| **Phase 3 — UI/UX** | User-friendly vault manager + error handling |
| **Phase 4 — Deploy** | Publish contracts to Sui Devnet & deploy frontend |

## 👥 Contributing & Team

### **Team Roles**
- **Chloe** — Architecture, frontend + Docker  
- **Jishnuu** — Move + Seal integration  
- **Wei Lun** — UX/UI, vault manager  
- **Evan** — Presentation, documentation, pitch deck  

### **Contribution Guide**
1. Claim an issue from the [**Issues**](../../issues) tab.  
2. Track progress via the [**Projects**](../../projects) board.  
3. Open PRs with clear descriptions of changes.

## 📜 License

Distributed under the MIT License. See LICENSE for details.
