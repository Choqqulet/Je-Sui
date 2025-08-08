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


## 🛠️ Technical Architecture

### **System Flow:**

<img width="516" height="747" alt="image" src="https://github.com/user-attachments/assets/b3b2d750-997e-4584-bbe1-e8f6e4bf5c0d" />

### **Security Architecture:**

### Threat Model

1. **Network Attacks**
    - Mitigation: End-to-end encryption, TLS for all communications
2. **Smart Contract Vulnerabilities**
    - Mitigation: Formal verification, security audits, upgrade mechanisms
3. **Client-side Attacks**
    - Mitigation: CSP headers, SRI for dependencies, secure key storage

### Encryption Scheme

```
Master Key Derivation:
zkProof + User Salt → Argon2id → Master Key

Per-Entry Encryption:
Master Key + Entry ID → HKDF → Entry Key
Entry Key + Plaintext → AES-256-GCM → Ciphertext
```

### Access Control Matrix

| Action | Owner | Authorized User | Public |
| --- | --- | --- | --- |
| Create Vault | ✓ | ✗ | ✗ |
| Read Entries | ✓ | ✓* | ✗ |
| Add Entry | ✓ | ✗ | ✗ |
| Update Entry | ✓ | ✗ | ✗ |
| Delete Entry | ✓ | ✗ | ✗ |
| Share Access | ✓ | ✗ | ✗ |
- With explicit permission via Seal capability

--- 

## 🚀 Getting Started

### 📦 Prerequisites
- **Node.js** v18+
- **Docker** installed
- **Sui CLI** installed (`sui move build`, `sui client publish`)
- Access to **Sui Devnet/Testnet** faucet ([https://faucet.sui.io](https://faucet.sui.io))

### 🖥️ Frontend 
```bash
cd frontend
npm install
npm run dev
```
set environment variables in frontend/.env
```bash
VITE_SUI_NETWORK=testnet
VITE_PACKAGE_ID=<your_published_package_id>
```

### Move Contracts

Docs are in /move/password_manager/README.md.

---

## 🗺️ Roadmap & Tasks

| Phase             | Description |
|-------------------|-------------|
| **Phase 1 — MVP** | zkLogin login → encrypt with Walrus → `create_vault()` Move call |
| **Phase 2 — Seal**| Integrate Seal for secure capability checks |
| **Phase 3 — UI/UX** | User-friendly vault manager + error handling |
| **Phase 4 — Deploy** | Publish contracts to Sui Devnet & deploy frontend |

## 👥 Contributing & Team

### **Team Roles**
- **Chloe** — Architecture, deploy
- **Jishnuu** — Move + Seal integration  
- **Wei Lun** — frontend, vault manager  
- **Evan** — Presentation, UX/UI, pitch deck  

### **Contribution Guide**
1. Claim an issue from the [**Issues**](../../issues) tab.  
2. Track progress via the [**Projects**](../../projects) board.  
3. Open PRs with clear descriptions of changes.

## 📜 License

Distributed under the MIT License. See LICENSE for details.
