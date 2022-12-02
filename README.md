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

# Run static Solidity analyzer https://github.com/crytic/slither
slither .
```


## Deployment

### 1. Configure

Create an `.env` file in the root directory and add these variables:

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

# Deploy to Goerli testnet
yarn deploy --network goerli

# Deploy to Ethereum mainnet
yarn deploy --network mainnet
```

### 3. Verify contract on Explorer (Etherscan, Snowtrace, Polygonscan)

```sh
# 1. Update CONTRACT_ADDRESS in .env

# GOERLI 0xA2dDe6Aa49838a3ef239e46a4a52d7e0E139556B
# MAINNET 0x18B99AC678c01C1511F818F58Af636920D7ffdD6

# 2. Make sure arguements.ts and deploy parameters match

# 3. Verify contract

# Verify on Snowtrace (Fuji)
npx hardhat verify --network fuji --constructor-args arguments.ts 0x3B72c90EA674706ab80E0D37F41fFac692ff55D9 --show-stack-traces

# Verify on Etherscan (Goerli)
npx hardhat verify --network goerli --constructor-args arguments.ts 0xA2dDe6Aa49838a3ef239e46a4a52d7e0E139556B --show-stack-traces

# Verify on Etherscan (Mainnet)
npx hardhat verify --network mainnet --constructor-args arguments.ts 0x18B99AC678c01C1511F818F58Af636920D7ffdD6 --show-stack-traces

```

#### Verification troubleshoot

If the contract was recently deployed it may not propagated to the backend yet. Try waiting for a minute before verifying your contract.

```sh
# Clear the cache and delete the artifacts
npx hardhat clean

# Make sure you have latest hardhat-etherscan plugin
yarn upgrade @nomiclabs/hardhat-etherscan --latest
```
