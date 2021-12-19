## Introduction

Prompts is a Solidity smart contract extending ERC721 with empty NFT initialization, duration, and verified contributors. It enables NFTs for collective performances.

In the current version, we assume the following scenario:
1. Summon contributors, create a multisig for all
2. Multisig mints an empty NFT, becomes the owner
3. Multisig adds members
4. *art happens here* (contributor membership is checked)
5. The owner multisig updates NFT with final URI

The Prompt server (to be implemented) will do the following:
1. Initalize a prompt based on the submitted `promptSchema` and return a `promptURI`
2. Validate a `contribution` against the `promptSchema` and return a `contributionURI`
3. Compile all `contributions` and return a `finalURI`, which will be the `tokenURI`

<div align="center">
  <img src="Prompts-diagram.png?raw=true">
</div>

## Prerequisites

1. Install the long-term support version of [nodejs](https://nodejs.org/en) (`16.10.0` at the time of writing).

1. Install [yarn](https://yarnpkg.com):
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

3. Run the tests on the default local network (compiles the cotnract and runs the tests)
```sh
yarn test

  Prompt contract
    Deployment
      ✓ has a name
      ✓ has a symbol
      ✓ has an owner
    Prompt
      ✓ mints a token with end time and members
      ✓ is an empty NFT
      ✓ minter is the owner
      ✓ has 3 members (owner + two members)
      ✓ owner can add a new member
      ✓ owner can add another member
      ✓ has total 5 members
      ✓ a member can contribute
      ✓ another member can contribute
      ✓ non-members not allowed to contribute
      ✓ get all contribution URIs
      ✓ owner can fill NFT (set tokenURI) and transfer to another address (multisig)
      ✓ is a filled NFT
      ✓ filled address is the new owner
```
## Deployment

Runs `scripts/deploy.ts` for picking the contracts to be deployed, and `hardhat.config.js` for picking the network to deploy.


```sh
# Deploy to local Hardhat network
yarn deploy

# Deploy to Ropsten
yarn deploy --network ropsten

# Verify contract on Ethersan
npx hardhat verify --network ropsten --constructor-args arguments.js DEPLOYED_CONTRACT_ADDRESS

# Deploy to Avalanche local network (via [Avash](https://docs.avax.network/build/tools/avash))
yarn deploy --network local

# Deploy to Fuji (Avalanche testnet)
yarn deploy --network fuji

# Deploy to Avalanche mainnet
yarn deploy --network mainnet
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

```sh
# Accounts in the network
yarn accounts

# Account balances
yarn balances

# Hardhat help
yarn hardhat

# Compile the smart contract:
yarn compile
```

## Hardhat Config

Hardhat uses `hardhat.config.js` as the configuration file. You can define tasks, networks, compilers and more in that file. For more information see [here](https://hardhat.org/config/).

In our repository we use a pre-configured file `hardhat.config.ts`. This file configures necessary network information to provide smooth interaction with local network as well as Avalanche testnet and mainnet. There are also some pre-defined private keys for testing on a local test network.


## Efficiency and Security

- We use [Hardhat Gas Reporter plugin](https://hardhat.org/plugins/hardhat-gas-reporter.html), which uses [Eth Gas Reporter](https://hardhat.org/plugins/hardhat-gas-reporter.html)

- We should use [Mythrill](https://github.com/ConsenSys/mythril) security analysis tool for EVM bytecode

