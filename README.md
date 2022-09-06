## Introduction

Exquisite Corpse is a collaborative, socially transmissible NFT. Inspired by the surrealist drawing technique, this NFT adaptation turns sequential contributions into a combined image, using the blockchain to orchestrate a viral collaborative artwork. Exquisite Corpse uses a Prompt smart contract, which extends the ERC-721 standard enabling time-bound, verifiable, and collaborative authorship.

Prompt contracts include several deployment parameters, duration, max supply, creation limit per account, as well as an allowlist function, which controls who can initiate a session and how collaborators may be added. The contract deployer is the first address in the `allowlist`. So, it should invite other addresses by adding them as contributors to prompt sessions.

## Prerequisites

1. Install the long-term support version of [nodejs](https://nodejs.org/en) (`16.10.0` at the time of writing).

2. Install [yarn](https://yarnpkg.com)
```sh
npm install -g yarn
```

## Installation and Running

### 1. Download
```sh
git clone git@github.com:prompts-studio/prompts-sol.git
cd prompts-sol
```

### 2. Build
```sh
yarn
```

### 3. Test
```sh
# Compile and run on local Hardhat network
yarn test ./test/prompt.test.js
```

## Deployment

### 1. Configure

Make sure you have a `.env` file in the project root directory:

```sh
ALCHEMY_API_KEY=
ETHERSCAN_KEY=
SNOWTRACE_KEY=
FEE_ADDRESS=
PRIVATE_KEY=
CONTRACT_ADDRESS=
```

### 2. Deploy

Commands below run `scripts/deploy.ts` for picking the contracts to be deployed, and `hardhat.config.js` for picking the network to deploy.

⚠️ Make sure you control the `FEE_ADDRESS` and `PRIVATE_KEY` for the deployed network in `.env` file.

```sh
# Deploy to local Hardhat network
yarn deploy

# Deploy to Avalanche Fuji testnet
yarn deploy --network fuji

# Deploy to Rinkeby testnet
yarn deploy --network rinkeby

# Deploy to Ethereum mainnet
yarn deploy --network mainnet
```

### 3. Verify contract on Explorer (Etherscan, Snowtrace, Polygonscan)

```sh
# 1. Update CONTRACT_ADDRESS in .env

# FUJI 0x3B72c90EA674706ab80E0D37F41fFac692ff55D9
# RINKEBY 0xA706906B42b537Cbd27284a7D30b3ffe4C9c5901
# MAINNET 0xa13d5470611fedbD9591C25527E5096C25986770

# 2. Verify contract

# Verify on Snowtrace (Fuji)
npx hardhat verify --network fuji --constructor-args arguments.ts 0x3B72c90EA674706ab80E0D37F41fFac692ff55D9 --show-stack-traces

# Verify on Etherscan (Rinkeby)
npx hardhat verify --network rinkeby --constructor-args arguments.ts 0xA706906B42b537Cbd27284a7D30b3ffe4C9c5901 --show-stack-traces

# Verify on Etherscan (Mainnet)
npx hardhat verify --network mainnet --constructor-args arguments.ts 0xa13d5470611fedbD9591C25527E5096C25986770 --show-stack-traces
```

#### Verification troubleshoot

If the contract was recently deployed it may not propagated to the backend yet. Try waiting for a minute before verifying your contract.

```sh
# Clear the cache and delete the artifacts
npx hardhat clean

# Make sure you have latest hardhat-etherscan plugin
yarn upgrade @nomiclabs/hardhat-etherscan --latest
```
