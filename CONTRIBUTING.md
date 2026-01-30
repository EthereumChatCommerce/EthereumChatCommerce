# Contributing to ChatCommerce

Thank you for your interest in contributing to **ChatCommerce**! We're building the future of decentralized, chat-based commerce and welcome contributions from developers of all backgrounds—especially those passionate about Web3 and the creator economy.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs & Security](#reporting-bugs--security)
- [Questions?](#questions)

---

## Code of Conduct

By participating in this project, you agree to uphold a respectful and inclusive environment. We expect all contributors to:

- Be respectful and constructive in discussions and code reviews
- Welcome newcomers and help others learn
- Focus on what is best for the community and the project
- Respect differing opinions, experiences, and backgrounds

---

## How Can I Contribute?

### Web3 & Decentralization

We're actively seeking contributors to help with:

| Area | Ideas |
|------|--------|
| **Payment integrations** | Web3 wallets (MetaMask, WalletConnect), crypto payments (ETH, USDC), multi-chain routing |
| **Smart contracts** | Payment contracts, unlock-key NFTs, escrow mechanisms |
| **Decentralized storage** | IPFS, Arweave, content addressing and verification |
| **Token gating & access** | Token-based access control, NFT-gated content, DAO/reputation integration |
| **Core platform** | Real-time messaging, scalable file uploads, auth and security improvements |

### Other Ways to Contribute

- **Bug reports** – Open an issue with clear steps to reproduce
- **Documentation** – Improve README, API docs, or add examples
- **Tests** – Add or improve unit and E2E tests
- **Code reviews** – Review open PRs and share feedback

If you're unsure where to start, check [open issues](https://github.com/EthereumChatCommerce/EthereumChatCommerce/issues) or ask in [GitHub Discussions](https://github.com/EthereumChatCommerce/EthereumChatCommerce/discussions).

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher  
- **MongoDB** v6.0+ (local or via Docker)  
- **npm** or **yarn**  
- **Git**

### Setup

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/EthereumChatCommerce/EthereumChatCommerce.git
   cd EthereumChatCommerce
   ```

2. **Add upstream remote** (optional, for syncing with main repo)

   ```bash
   git remote add upstream https://github.com/EthereumChatCommerce/EthereumChatCommerce.git
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Configure environment**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your MongoDB URI and (for payment features) Stripe test keys. See [README.md](README.md#environment-variables) for details.

5. **Run the app**

   ```bash
   # Start MongoDB (if using Docker)
   docker-compose up -d mongodb

   # Start dev server
   npm run start:dev
   ```

   API will be available at `http://localhost:3000`.

For full Docker setup, see [DOCKER_SETUP.md](DOCKER_SETUP.md).

---

## Development Workflow

### Branch naming

- `feature/short-description` – New features  
- `fix/short-description` – Bug fixes  
- `docs/short-description` – Documentation only  
- `chore/short-description` – Tooling, config, refactors  

Examples: `feature/web3-wallet-auth`, `fix/chat-room-creation`, `docs/api-examples`.

### Commit messages

- Use present tense: *"Add Web3 wallet support"* not *"Added..."*
- First line: short summary (about 50 chars). Optionally add a blank line and a longer description.
- Reference issues when relevant: `Fix chat room creation (#123)`.

### Keeping your fork in sync

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

---

## Coding Standards

- **Language**: TypeScript (strict mode).
- **Framework**: Follow [NestJS](https://docs.nestjs.com/) conventions (modules, services, DTOs, dependency injection).
- **Formatting**: [Prettier](https://prettier.io/) (single quotes, trailing commas). Run before committing:
  ```bash
  npm run format
  ```
- **Linting**: ESLint. Fix auto-fixable issues:
  ```bash
  npm run lint
  ```

Project layout:

- `src/auth/` – Authentication  
- `src/users/` – User management  
- `src/chat/` – Chat rooms and messaging  
- `src/files/` – File upload and gating  
- `src/payments/` – Payments (Stripe → Web3-ready)  
- `src/products/` – Product profiles  

Place new features in the appropriate module and add/update tests as needed.

---

## Testing

- **Unit tests**: `*.spec.ts` next to the code. Run:
  ```bash
  npm run test
  ```
- **E2E tests**: In `test/`. Run:
  ```bash
  npm run test:e2e
  ```
- **Coverage**:
  ```bash
  npm run test:cov
  ```

Please add or update tests for new behavior and ensure `npm run test` and `npm run test:e2e` pass before submitting a PR.

---

## Pull Request Process

1. **Create a branch** from `main` using the naming above.
2. **Implement your changes** and follow the coding standards.
3. **Run checks**:
   ```bash
   npm run format
   npm run lint
   npm run test
   npm run test:e2e
   ```
4. **Commit** with clear messages and push to your fork.
5. **Open a Pull Request** against the `main` branch of the upstream repo.
6. **Fill in the PR template** (if any): describe what changed, why, and how to test.
7. **Address review feedback**; we may ask for changes before merging.

By submitting a PR, you agree that your contributions will be licensed under the project’s [MIT License](LICENSE).

---

## Reporting Bugs & Security

- **Bugs**: Open a [GitHub issue](https://github.com/EthereumChatCommerce/EthereumChatCommerce/issues) with:
  - Clear title and description  
  - Steps to reproduce  
  - Expected vs actual behavior  
  - Environment (Node version, OS, etc.)  

- **Security**: Do **not** report security vulnerabilities in public issues. See [SECURITY.md](SECURITY.md) for how to report them responsibly.

---

## Questions?

- [GitHub Discussions](https://github.com/EthereumChatCommerce/EthereumChatCommerce/discussions) – Ideas, questions, and general chat  
- [Open an issue](https://github.com/EthereumChatCommerce/EthereumChatCommerce/issues) – Bug reports and feature requests  

Thank you for helping build the future of chat-based commerce.
