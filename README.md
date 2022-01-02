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
      ✓ has deployment parameters: memberLimit, totalSupply, mintFee, feeAddress
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
      ✓ owner can finalize (set tokenURI) and transfer to an address
      ✓ is a finalized NFT
      ✓ finalized address is the new owner
```
## Deployment

Runs `scripts/deploy.ts` for picking the contracts to be deployed, and `hardhat.config.js` for picking the network to deploy.


Deploy to local Hardhat network
```sh
yarn deploy
```

Deploy to Ropsten
```sh
yarn deploy --network ropsten

# Add the deployed contract address in hardhat.config.ts
const CONTRACT_ADDRESS = '0xb99441da4a918604d4ee7d1cb20b362bd3c12705';

# Verify the contract on Etherscan
npx hardhat verify --network ropsten --constructor-args arguments.js 0xb99441da4a918604d4ee7d1cb20b362bd3c12705
```

Deploy to Avalanche local network (via [Avash](https://docs.avax.network/build/tools/avash))
```sh
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

const name = "Prompts";
const symbol = "pNFT";
const memberLimit = 3;
const supply = 100;
const mintFee = ethers.utils.parseUnits("0.001", "ether");
const feeAddress = "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC";
const Prompt = await ethers.getContractFactory('Prompts');
const prompt = await Prompt.deploy(name, symbol, memberLimit, supply, mintFee, feeAddress);

await prompt.name()
await prompt.symbol()
await prompt.owner()

const members = [accounts[0], accounts[1], accounts[2]];
const contributionURI = "'https://contr..."
const endsAt = 1501505;
await prompt.mint(accounts[0], endsAt, members, contributionURI)

const tokenId = 0
const pEndsAt = await prompt.prompts(tokenId).endsAt

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

