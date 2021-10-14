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

Deploy the smart contract following the `scripts/deploy.ts`. For example, the code below deploys to local Avash network (5 mode Avalanche network). Deploy scripts also has options for Ethereum mainnet and Fuji testnet (Avalanche).
```sh
yarn deploy --network local
```

## Hardhat Config

Hardhat uses `hardhat.config.js` as the configuration file. You can define tasks, networks, compilers and more in that file. For more information see [here](https://hardhat.org/config/).

In our repository we use a pre-configured file `hardhat.config.ts`. This file configures necessary network information to provide smooth interaction with local network as well as Avalanche testnet and mainnet. There are also some pre-defined private keys for testing on a local test network.

