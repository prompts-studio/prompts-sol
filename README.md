## Introduction

Prompts is a Solidity smart contract extending ERC721 with empty minting, duration, and verified contributors. It enables NFTs for collective performances.

A deployed Prompt contract enables the following:
1. Mint an NFT by adding `endsAt`, `members`, and the first `contribution`mint)
2. All members are added to the `allowlist`, only allowed addresses can mint
3. NFT is minted empty and owned by the provided `to` address
4. Members can add their contributions before the end time
5. When the end time ends, any member can finalize the NFT

Note that the contract deployer address is the first account in allowlist. So it should make the first mint and add others.

[The Prompt app](https://github.com/arikan/prompts-app):
1. Users connects their wallet
2. Mint an empty NFT with the first contribution and the list of contributors (end time is set 24hrs from current blocktime by default)
3. Users share the NFT link with contributors
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

3. Test (compiles and runs on local Hardhat network)
```sh
yarn test
Prompt contract
    Deployment
      ✓ has a name
      ✓ has a symbol
      ✓ has an owner
      ✓ has deployment parameters: memberLimit, totalSupply, mintFee, feeAddress
    Prompt
      ✓ deployer address in the allowlist
      ✓ mints a token with endsAt, members, and first contribution
      ✓ cannot mint if not in allowlist
      ✓ can mint if in allowlist
      ✓ cannot mint if reached token supply limit
      ✓ has token count
      ✓ is an empty NFT
      ✓ minter is the owner
      ✓ has initially 3 members
      ✓ owner can add a new member
      ✓ cannot add member if limit is reached
      ✓ has total 4 members
      ✓ a member can contribute
      ✓ cannot finalize if not ended and not completed
      ✓ a member cannot contribute more than once
      ✓ another member can contribute
      ✓ last member can contribute
      ✓ non-members are not allowed to contribute
      ✓ is prompt completed?
      ✓ get prompt
      ✓ any member can finalize
      ✓ is a finalized NFT
```

Note that `getPrompt(tokenId)` returns full prompt data:
- `address` owner
- `blocktime` endsAt
- `address[]` members
- `Contribution[]` contributions
```js
[
  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  BigNumber { _hex: '0x61eb1cd3', _isBigNumber: true },
  '',
  [
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    '0x90F79bf6EB2c4f870365E785982E1f101E93b906'
  ],
  [
    [
      'https://zero...',
      [BigNumber],
      '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      contributionURI: 'https://zero...',
      createdAt: [BigNumber],
      creator: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
    ],
    [
      'https://one...',
      [BigNumber],
      '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      contributionURI: 'https://one...',
      createdAt: [BigNumber],
      creator: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
    ],
    [
      'https://two...',
      [BigNumber],
      '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      contributionURI: 'https://two...',
      createdAt: [BigNumber],
      creator: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'
    ],
    [
      'https://two...',
      [BigNumber],
      '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
      contributionURI: 'https://two...',
      createdAt: [BigNumber],
      creator: '0x90F79bf6EB2c4f870365E785982E1f101E93b906'
    ]
  ]
]
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
```

Deploy to Avalanche
```sh
# Deploy to local network (run Avash https://docs.avax.network/build/tools/avash)
yarn deploy --network local

# Deploy to Fuji (Avalanche testnet)
yarn deploy --network fuji

# Deploy to Avalanche mainnet
yarn deploy --network mainnet
```

Verify contract on Etherscan
```sh
# Add the deployed contract address in hardhat.config.ts
const CONTRACT_ADDRESS = '0x1678B18a370C65004c8e4e03b6bf4bE76EaDf4F1';

# Verify the contract on Etherscan
npx hardhat verify --network ropsten --constructor-args arguments.js 0x1678B18a370C65004c8e4e03b6bf4bE76EaDf4F1
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

