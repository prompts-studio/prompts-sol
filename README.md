## Introduction

Prompts Solidity smart contract extends the ERC721 non-fungible token standard to enable time-bound verifiable collaborative authorship.

In the Prompts contract, every session is a group performance that generates a jointly-owned artifact in the form of an NFT. These event derivatives may then be carried into future sessions, traded and remixed to build up a referential conversation among successive prompt participants.

Prompt contracts include several deployment parameters, duration, max supply, creation limit per account, as well as an allowlist function, which controls who can initiate a session and how collaborators may be added.

The contract deployer is the first address in the `allowlist`. So, it should invite other addresses by adding them as contributors to prompt sessions.

## Prerequisites

1. Install the long-term support version of [nodejs](https://nodejs.org/en) (`16.10.0` at the time of writing).

2. Install [yarn](https://yarnpkg.com):
```sh
npm install -g yarn
```

## Installation and Running

### 1. Download
```sh
git clone git@github.com:arikan/prompts-sol.git
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

⚠️ Make sure you control the `FEE_ADDRESS` in the deployed network, update it in `.env` file.

```sh
# Deploy to local Hardhat network
yarn deploy

# Deploy to Avalanche local network (run Avash https://docs.avax.network/build/tools/avash)
yarn deploy --network local

# Deploy to Ropsten testnet
yarn deploy --network ropsten

# Deploy to Rinkeby testnet
yarn deploy --network rinkeby

# Deploy to Rinkeby testnet
yarn deploy --network goerli

# Deploy to Fuji testnet (Avalanche)
yarn deploy --network fuji

# Deploy to Avalanche mainnet
yarn deploy --network avalanche

# Deploy to Polygon testnet
yarn deploy --network mumbai

# Deploy to Polygon mainnet
yarn deploy --network polygon

# Deploy to Ethereum mainnet
# uppdate these in .env
# FEE_ADDRESS=0xa8CA4cF975a4DF6194c8B30F1501f30FCd557c9C
# PRIVATE_KEY=<the deploying account>
yarn deploy --network mainnet
```

### 3. Verify contract on Explorer (Etherscan, Snowtrace, Polygonscan)

```sh
# 1. Update CONTRACT_ADDRESS in .env

# FUJI 0x3B72c90EA674706ab80E0D37F41fFac692ff55D9
# ROPSTEN 0x3d60c48bf526F4F74567C79d178BD58016f55F49
# RINKEBY 0x407583e3EDEF1B9062Ef640cDA8A7B0147D45091
# RINKEBY2 0xA706906B42b537Cbd27284a7D30b3ffe4C9c5901
# GOERLI 0xcD4Bb04b2106d2E6075bdC19DbFA83C9DBc2F0a2
# AVALANCHE 0x0e8fF6e68eB11D4B36183C0Bb46a61D0D75FC010
# MUMBAI 0xcD4Bb04b2106d2E6075bdC19DbFA83C9DBc2F0a2
# POLYGON 0xcD4Bb04b2106d2E6075bdC19DbFA83C9DBc2F0a2
# MAINNET 0xa13d5470611fedbD9591C25527E5096C25986770

# 2. Verify contract

# Verify on Snowtrace (Fuji)
npx hardhat verify --network fuji --constructor-args arguments.ts 0x3B72c90EA674706ab80E0D37F41fFac692ff55D9 --show-stack-traces

# Verify on Etherscan (Ropsten)
npx hardhat verify --network ropsten --constructor-args arguments.ts 0x3d60c48bf526F4F74567C79d178BD58016f55F49 --show-stack-traces

# Verify on Etherscan (Rinkeby)
npx hardhat verify --network rinkeby --constructor-args arguments.ts 0xA706906B42b537Cbd27284a7D30b3ffe4C9c5901 --show-stack-traces

# Verify on Etherscan (Goerli)
npx hardhat verify --network goerli --constructor-args arguments.ts 0xcD4Bb04b2106d2E6075bdC19DbFA83C9DBc2F0a2 --show-stack-traces

# Verify on Etherscan (Mainnet)
npx hardhat verify --network mainnet --constructor-args arguments.ts 0xa13d5470611fedbD9591C25527E5096C25986770 --show-stack-traces

# Verify on Snowtrace (Avalanche)
npx hardhat verify --network avalanche --constructor-args arguments.ts 0x0e8fF6e68eB11D4B36183C0Bb46a61D0D75FC010 --show-stack-traces

# Verify on Mumbai (Polygon)
npx hardhat verify --network mumbai --constructor-args arguments.ts 0xcD4Bb04b2106d2E6075bdC19DbFA83C9DBc2F0a2 --show-stack-traces

# Verify on Polygon
npx hardhat verify --network polygon --constructor-args arguments.ts 0xcD4Bb04b2106d2E6075bdC19DbFA83C9DBc2F0a2 --show-stack-traces

# Verification troubleshoot:

# If the contract was recently deployed and this fact hasn't propagated to the backend yet. Try waiting for a minute before verifying your contract.

# Clear the cache and delete the artifacts
npx hardhat clean

# Make sure you have latest hardhat-etherscan plugin
yarn upgrade @nomiclabs/hardhat-etherscan --latest
```
