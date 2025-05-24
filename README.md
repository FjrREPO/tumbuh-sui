# Tumbuh - Sui Blockchain dApp

A modern decentralized application built on the Sui blockchain, featuring a Next.js web interface with HeroUI components.

## Project Structure

```
tumbuh/
├── web/              # Next.js frontend application
│   ├── app/         # Next.js app directory
│   ├── components/  # Reusable UI components
│   ├── lib/        # Utility functions and shared logic
│   ├── hooks/      # Custom React hooks
│   └── public/     # Static assets
```

## Technology Stack

- **Blockchain**
  - Sui Blockchain (@mysten/sui v1.30.0)
  - Sui dApp Kit (@mysten/dapp-kit v0.16.4)
- **Frontend**
  - Next.js 15
  - HeroUI Components (v2)
  - TypeScript
  - TailwindCSS
  - React 18
- **Package Management**
  - pnpm (v10.11.0+)

## Prerequisites

- Node.js (v18 or higher recommended)
- pnpm (v10.11.0 or higher)
- A modern web browser with Sui wallet extension

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd tumbuh
```

2. Install web frontend dependencies:
```bash
cd web
pnpm install
```

Note: When using pnpm, ensure your `.npmrc` includes:
```
public-hoist-pattern[]=*@heroui/*
```

## Development

To start the development server:

```bash
# In the web directory
pnpm dev
```

This will start the Next.js development server with Turbopack enabled.

## Building for Production

To create a production build:

```bash
# In the web directory
pnpm build
pnpm start
```

## Usage

1. Ensure you have a Sui wallet installed in your browser
2. Connect your wallet to the application
3. Navigate through the application using the provided interface
4. Interact with the Sui blockchain through the dApp interface

## License

This project is licensed under the MIT License - see the LICENSE file for details.

