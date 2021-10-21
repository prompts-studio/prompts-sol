## Introduction

Prompts is a Solidity smart contract extending ERC721 with duration and verified contributions. It enables collective performance NFTs.

## Prerequisites

1. Install the long-term support version of [nodejs](https://nodejs.org/en) (`16.10.0` at the time of writing).

1. Install [yarn](https://yarnpkg.com):
```sh
npm install -g yarn
```

## How to run

1. Download
```sh
git clone git@github.com:arikan/prompts-sol.git
cd prompts-sol
```

2. Build
```sh
yarn
```

3. Run the tests on the default local network (compiles the cotnract and runs the tests)
```sh
yarn test

Prompt contract
 Deployment
   ✓ has a name
   ✓ has a symbol
   ✓ has an owner
 Prompt
   ✓ mints a token
   ✓ is an empty NFT
   ✓ has a member
   ✓ a member can add a new member
   ✓ has multiple members
   ✓ a member can contribute
   ✓ another member can contribute
   ✓ non-members can contribute
   ✓ owner can fill NFT / set tokenURI
   ✓ is a filled NFT
```

## Explore the code

View `contracts/prompts.sol` for the prompts contract.

View `test/prompts.test.js` for the JS queries to the contract functions.

View `package.json` for the available commands.

View the accounts in the network:
```sh
yarn accounts
```

View the account balances
```sh
yarn balances
```

Hardhat help
```sh
yarn hardhat
```

Compile the smart contract
```sh
yarn compile
```

## Deployment
Deploy command runs `scripts/deploy.ts`, which picks the contracts to be deployed, and based on the `hardhat.config.js`, it picks which network to deploy.

Deploy to local Hardhat network
```sh
yarn deploy
```

Deploy to Avalanche local network, a 5-node network (using [Avash](https://docs.avax.network/build/tools/avash)) with an EVM chain
```sh
yarn deploy --network local
```

Deploy to Avalanche testnet Fuji
```sh
yarn deploy --network fuji
```

Deploy to Avalanche mainnet
```sh
yarn deploy --network mainnet
```

## Hardhat Config

Hardhat uses `hardhat.config.js` as the configuration file. You can define tasks, networks, compilers and more in that file. For more information see [here](https://hardhat.org/config/).

In our repository we use a pre-configured file `hardhat.config.ts`. This file configures necessary network information to provide smooth interaction with local network as well as Avalanche testnet and mainnet. There are also some pre-defined private keys for testing on a local test network.


## Efficiency and Security

- We use [Hardhat Gas Reporter plugin](https://hardhat.org/plugins/hardhat-gas-reporter.html), which uses [Eth Gas Reporter](https://hardhat.org/plugins/hardhat-gas-reporter.html)
- Security analysis tool for EVM bytecode. https://github.com/ConsenSys/mythril

