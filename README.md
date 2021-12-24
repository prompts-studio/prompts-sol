## Introduction

Prompts is a Solidity smart contract extending ERC721 with empty minting, duration, and verified contributors. It enables NFTs for collective performances.

A deployed Prompt contract enables the following:
1. Mint an NFT by adding `endsAt`, `members`, and the first `contribution`
2. NFT is minted empty and owned by the provided `to` address
3. Members can add their contributions before the end time
4. When the end time ends, owner finalizes the NFT to their multisig address

The Prompt app will do the following:
1. Let the user connect wallet
2. Mint an empty NFT with first contribution and the list of contributors (end time is set default)
3. The user shares the NFT link with contributors
4. Contributors connect wallet and submit their contribution. The app uploads the image to IPFS, takes the contributionURI, and calls `contribute(tokenId, contributionURI)`
5. After the end time reached, owner finalizes the NFT. The app compiles the latest contributions (one account can have multiple) together into a single JSON, uploads to IPFS, and gets the tokenID, and calls with a multisig address `fill(tokenId, tokenURI, to)`.

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
      ✓ has deployment parameters: memberLimit, supply, mintFee, feeAddress
    Prompt
      ✓ mints a token with endsAt, members, and first contribution
      ✓ is an empty NFT
      ✓ minter is the owner
      ✓ has initially 3 members
      ✓ owner can add a new member
      ✓ cannot add member if limit is reached
      ✓ has total 4 members
      ✓ a member can contribute
      ✓ another member can contribute
      ✓ non-members not allowed to contribute
      ✓ get all contribution URIs
      ✓ owner can fill NFT (set tokenURI) and transfer to an address (possibly multisig)
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

# Verify contract on Etherscan
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

