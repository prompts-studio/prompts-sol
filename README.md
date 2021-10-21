## Introduction

Prompts is a Solidity smart contract extending ERC721 with duration and verified contributions. It enables collective performance NFTs.

In the current version, a multisig account deploys the Prompts contract and becomes the owner. By calling this contract, anyone can mint a Prompt as an empty NFT, anyone can contribute to this prompt, and only the multisig owner can fill / finalize the prompt.

The Prompt server (to be implemented) will do the following:
- initalize a prompt based on the submitted `promptSchema` and return a `promptURI`
- validate a `contribution` against the `promptSchema` and return a `contributionURI`
- compile all `contributions` and return a `finalURI`

Since anyone can contribute, non-validated contributions can be added to the contract. However, only the contract owner can fill to finalize the prompt. So the owner can make sure only valid contributions are added to the final compilation.

<div align="center">
  <img src="Prompts-diagram.png?raw=true">
</div>

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
   ✓ a non-member can contribute
   ✓ get all contribution URIs
   ✓ owner can fill NFT / set tokenURI
   ✓ is a filled NFT
```

## Interact with Smart Contract

[Hardhat has built-in interactive JS console](https://hardhat.org/guides/hardhat-console.html#using-the-hardhat-console) to interact with the smart contract manually.

```sh
yarn console
```

```js
// Run these commands line by line
let accounts = await ethers.provider.listAccounts()
accounts
['0x...', '0x...', ]

const Prompt = await ethers.getContractFactory('Prompts');
prompt = await Prompt.deploy('Prompts', 'PNFT')
await prompt.name()
await prompt.symbol()
await prompt.owner()
await prompt.mint(accounts[0], 'https://prompt...', 100)
const tokenId = 0
await prompt.tokenURI(tokenId)
await prompt.isMember(tokenId, accounts[0])
await prompt.contribute(tokenId, 'https://contribution...')
await prompt.getContributions(tokenId)
await prompt.fill(account[1], tokenId, 'https://finalTokenURI...')
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

