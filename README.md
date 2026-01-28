# 💬 ChatCommerce - Decentralized Chat-Based Commerce Platform

<div align="center">

**Building the future of creator economy through chat-based commerce**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

*Empowering creators to monetize content directly through chat conversations*

</div>

---

## 🌟 Vision

ChatCommerce is an **open-source NestJS API** that enables a new paradigm of commerce: **chat-based transactions with gated content**. Think of it as combining the real-time nature of Telegram/WhatsApp with the monetization capabilities of platforms like OnlyFans or Patreon, but **open, permissionless, and community-driven**.

### Why This Matters for Web3

- **Creator Economy**: Enable creators to monetize their content directly without platform intermediaries
- **Microtransactions**: Pay-per-unlock model perfect for crypto-native payment integrations
- **Decentralization Ready**: Built with extensibility in mind—easily integrate blockchain payments, NFTs, and smart contracts
- **Open Source**: MIT licensed—truly permissionless and community-owned
- **Real-time & Scalable**: WebSocket-based architecture ready for high-throughput messaging

---

## 🚀 Core Features (MVP)

### Current Implementation

- ✅ **User Authentication**: Email/password or JWT-based auth
- ✅ **1:1 Chat Rooms**: Direct messaging between two users
- ✅ **File Uploads**: Support for images, PDFs, and other media
- ✅ **Gated Content**: Files can be locked and require payment to unlock
- ✅ **Payment Integration**: Stripe integration for unlocking content (test mode ready)
- ✅ **Real-time Messaging**: WebSocket support via Socket.IO
- ✅ **Product Profiles**: Users can link products to their profiles (foundation for future marketplace features)

### Future Roadmap (Web3 Integration Opportunities)

- 🔮 **Crypto Payments**: Integrate Web3 wallets (MetaMask, WalletConnect) for unlocking content
- 🔮 **NFT Integration**: Link NFTs to user profiles or use as unlock keys
- 🔮 **Smart Contracts**: Deploy payment contracts on EVM chains
- 🔮 **IPFS Storage**: Decentralized file storage for true decentralization
- 🔮 **Token Gating**: Unlock content based on token holdings
- 🔮 **Multi-chain Support**: Support for Ethereum, Polygon, Base, and more

---

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) (TypeScript)
- **Database**: PostgreSQL with TypeORM
- **Real-time**: WebSockets via `@nestjs/websockets` with Socket.IO
- **File Storage**: Local filesystem (MVP) → S3-ready architecture
- **Payments**: Stripe (MVP) → Web3 wallet integration ready
- **Authentication**: JWT-based auth system

---

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/chat_commerce.git
cd chat_commerce

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and Stripe credentials

# Run database migrations
npm run migration:run

# Start development server
npm run start:dev
```

The API will be available at `http://localhost:3000`

### Environment Variables

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=your_user
DATABASE_PASSWORD=your_password
DATABASE_NAME=chat_commerce

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Stripe (for MVP)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Server
PORT=3000
NODE_ENV=development
```

---

## 🏗️ Project Structure

```
chat_commerce/
├── src/
│   ├── auth/           # Authentication module
│   ├── users/          # User management
│   ├── chat/           # Chat rooms and messaging
│   ├── files/          # File upload and gating
│   ├── payments/       # Payment processing (Stripe → Web3 ready)
│   ├── products/       # Product profiles (future marketplace)
│   └── main.ts         # Application entry point
├── test/               # E2E tests
└── ...
```

---

## 🤝 Contributing

**We're actively seeking Web3 enthusiasts to help build the future of decentralized commerce!**

### How Web3 Developers Can Contribute

1. **Payment Integrations**
   - Integrate Web3 wallet providers (MetaMask, WalletConnect)
   - Add support for crypto payments (ETH, USDC, etc.)
   - Implement multi-chain payment routing

2. **Smart Contract Integration**
   - Design and deploy payment smart contracts
   - Create unlock key NFT contracts
   - Build escrow mechanisms for secure transactions

3. **Decentralized Storage**
   - Integrate IPFS for file storage
   - Implement Arweave for permanent storage
   - Build content addressing and verification

4. **Token Gating & Access Control**
   - Implement token-based access control
   - Create NFT-gated content features
   - Build reputation/DAO token integration

5. **Core Features**
   - Enhance real-time messaging performance
   - Build scalable file upload system
   - Improve authentication and security

### Contribution Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Workflow

```bash
# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Check code formatting
npm run format

# Lint code
npm run lint
```

---

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with email/password
- `POST /auth/refresh` - Refresh JWT token

### Chat
- `GET /chat/rooms` - List user's chat rooms
- `POST /chat/rooms` - Create new chat room
- `GET /chat/rooms/:id/messages` - Get messages in room
- `POST /chat/rooms/:id/messages` - Send message
- `WS /chat` - WebSocket connection for real-time messaging

### Files
- `POST /files/upload` - Upload file to chat
- `POST /files/:id/unlock` - Pay to unlock file
- `GET /files/:id` - Get file metadata

### Payments
- `POST /payments/unlock` - Process unlock payment
- `GET /payments/status/:id` - Check payment status

---

## 🔌 WebSocket Events

### Client → Server
- `join_room` - Join a chat room
- `send_message` - Send a message
- `typing` - User is typing indicator

### Server → Client
- `message` - New message received
- `file_uploaded` - File uploaded to chat
- `file_unlocked` - File unlocked after payment
- `user_typing` - User typing indicator

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌐 Community

- **Discord**: [Join our community](https://discord.gg/your-server)
- **Twitter**: [@ChatCommerce](https://twitter.com/chatcommerce)
- **GitHub Discussions**: [Ask questions and share ideas](https://github.com/yourusername/chat_commerce/discussions)

---

## 🙏 Acknowledgments

Built with ❤️ by the Web3 community, for the Web3 community.

Special thanks to:
- The NestJS team for the amazing framework
- All contributors who are helping build the future of decentralized commerce

---

## 🗺️ Roadmap

### Phase 1: MVP (Current)
- [x] Basic chat functionality
- [x] File uploads
- [x] Payment gating (Stripe)
- [x] User authentication

### Phase 2: Web3 Integration
- [ ] Web3 wallet authentication
- [ ] Crypto payment support
- [ ] IPFS file storage
- [ ] Smart contract integration

### Phase 3: Advanced Features
- [ ] NFT-based unlocks
- [ ] Token gating
- [ ] Multi-chain support
- [ ] DAO governance integration

### Phase 4: Marketplace
- [ ] Product listings
- [ ] Search and discovery
- [ ] Reviews and ratings
- [ ] Escrow services

---

<div align="center">

**Ready to build the future of chat-based commerce? Let's build it together! 🚀**

[⭐ Star us on GitHub](https://github.com/yourusername/chat_commerce) | [🤝 Contribute](CONTRIBUTING.md) | [📖 Documentation](https://docs.chatcommerce.io)

</div>
