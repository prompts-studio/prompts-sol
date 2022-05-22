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

1. Download
```sh
git clone git@github.com:arikan/prompts-sol.git
cd prompts-sol
```

2. Build
```sh
yarn
```

3. Test

```sh
yarn test # Compiles and runs on local Hardhat network
```

## Deployment

### 1. Configure

Make sure you have a `.env` file in the project root directory:

```sh
ALCHEMY_API_KEY=
ETHERSCAN_KEY=
SNOWTRACE_KEY=
FEE_ADDRESS=
ROPSTEN_PRIVATE_KEY=
FUJI_PRIVATE_KEY=
ROPSTEN_CONTRACT_ADDRESS=
FUJI_CONTRACT_ADDRESS=
```

### 2. Deploy

Commands below run `scripts/deploy.ts` for picking the contracts to be deployed, and `hardhat.config.js` for picking the network to deploy.

```sh
# Deploy to local Hardhat network
yarn deploy

# Deploy to Avalanche local network (run Avash https://docs.avax.network/build/tools/avash)
yarn deploy --network local

# Deploy to Ropsten testnet
yarn deploy --network ropsten

# Deploy to Rinkeby testnet
yarn deploy --network rinkeby

# Deploy to Avalanche testnet Fuji
yarn deploy --network fuji

# Deploy to Avalanche mainnet
yarn deploy --network mainnet
```

### 3. Verify contract on Explorer (Etherscan, Snowtrace)

```sh
# 1. Update .env with deployed contract address
ROPSTEN_CONTRACT_ADDRESS=0x3d60c48bf526F4F74567C79d178BD58016f55F49
RINKEBY_CONTRACT_ADDRESS=0x1594c71FE3f7Bb6ACeCD97e014986090589C57bD
FUJI_CONTRACT_ADDRESS=0xeC3fCb985FD2F95F4a54b8d97889Ac2AA68Cbd88

# 2. add Deployed contract address to hardhat.config.ts

# 3. Verify contract

# Verify on Etherscan (Ropsten)
npx hardhat verify --network ropsten --constructor-args arguments.ts 0x3d60c48bf526F4F74567C79d178BD58016f55F49 --show-stack-traces

# Verif on Etherscan (Rinkeby)
npx hardhat verify --network ropsten --constructor-args arguments.ts 0x1594c71FE3f7Bb6ACeCD97e014986090589C57bD --show-stack-traces

# Verify on Snowtrace
npx hardhat verify --network fuji --constructor-args arguments.ts 0xeC3fCb985FD2F95F4a54b8d97889Ac2AA68Cbd88 --show-stack-traces

# Verification troubleshoot:

# Clear the cache and delete the artifacts
npx hardhat clean

# Make sure you have latest hardhat-etherscan plugin
yarn upgrade @nomiclabs/hardhat-etherscan --latest
```
