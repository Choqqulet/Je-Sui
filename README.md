# Je-Sui — On-Chain Password Manager

**Experimenting with decentralized, walletless credentials storage — powered by Sui, zkLogin, Seal, and Walrus.**

---

##  Project Overview

This project is a **decentralized password manager** built for the Sui Hackathon (DEVMatch 2025). It enables users to manage encrypted credentials without wallets via email-based zkLogin while maintaining full ownership through on-chain enforcement.

**Core Elements:**

- **zkLogin** — Google-based zero-knowledge login, no wallet needed  
- **Walrus** — Client-side encryption and decentralized blob storage  
- **Sui Move + Seal** — On-chain ownership via vault objects sealed to user  
- **Frontend** — React + Vite UI, full end-to-end flow  
- **Dockerized** — Reproducible builds with static front-end server

---

##  Project Status

- [x] GitHub repo ready  
- [x] Frontend scaffold created (Vite + React/TS)  
- [x] Dockerfile for production build and serving compiled  
- [ ] Move contract stubbed (Vault struct, create/update flows)  
- [ ] zkLogin hook and Walrus client logic pending  
- [ ] Seal integration: import, APIs, and Move check logic still testing  
- [ ] Full end-to-end flow yet to be validated  

---

##  Architecture

**System Flow:**

```mermaid
graph TB
  A[User (email login via zkLogin)] --> B[Frontend (React)]
  B --> C[Walrus: encrypt & write blob → blobId]
  B --> D[Move Contract: create/update vault using blobId (Sui)]
  C <--> D[Blob metadata on-chain, encrypted data stored off-chain]
