
# Trend Mint Magic

Trend Mint Magic is a modern web application for minting NFTs (Non-Fungible Tokens) on the Hedera Hashgraph network. It provides a seamless wallet connection experience, supports both testnet and mainnet, and offers user-friendly features for interacting with your Hedera account.

## Features

- **Wallet Connect:** Easily connect and disconnect your Hedera wallet.
- **Network Support:** Switch between Hedera testnet and mainnet.
- **Account Management:** Copy your account ID, view it in HashScan, and manage your wallet state.
- **Custom Toast Notifications:** Get instant feedback for actions like connecting, disconnecting, and copying account IDs.
- **Modern UI:** Clean, responsive interface built with React and TypeScript.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/mitesh101010/nft-mint.git
   cd nft-mint
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```

4. **Open the app:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- Connect your Hedera wallet using the provided UI.
- Mint NFTs and manage your account.
- Use the copy and explorer features for easy account management.

## Project Structure

- `src/components/WalletConnect.tsx` – Main wallet connection logic and UI.
- `public/` – Static assets.
- `README.md` – Project documentation.

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [Hedera Hashgraph](https://hedera.com/)
- [React](https://react.dev/)
- [HashPack Wallet](https://www.hashpack.app/)
