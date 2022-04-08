## Introduction

Prompts is a Solidity smart contract extending ERC721 with empty minting, duration, and verified contributors. It enables NFTs for collective performances.

A deployed Prompt contract enables the following:
1. Create a prompt by adding `endsAt`, `members`, and the first `contribution`
2. All members are added to the `allowlist`, only allowed addresses can create prompt
3. Members can add their contributions and set its price before the end time
4. Contributors can set new price to their contributions
5. When the end time ends or contributions complted, anyone can mint the NFT paying the total price

Note that the contract deployer address is the first account in allowlist. So it should make the first mint and add others.

[The Prompt app](https://github.com/arikan/prompts-app):
1. Create a prompt with the first contribution and 2 contributor addreses
2. Share the link with contributors
3. Contributors submit their contribution.
4. When prompt is completed (endTime reached or all contributions done) it becomes mintable.
5. Anyone can mint the final NFT paying the total price, which is sent to creators

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
```

Note that `getPrompt(tokenId)` returns full prompt data:
- `address` owner
- `blocktime` endsAt
- `string` tokenURI
- `address[]` members
- `Contribution[]` contributions
```js
[
  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  BigNumber { _hex: '0x61f354b9', _isBigNumber: true },
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
    ]
  ]
]s
```

## Deployment

Make sure you have a `.env` file in the project root directory:

```sh
ETHERSCAN_KEY=
ALCHEMY_API_KEY=
ROPSTEN_PRIVATE_KEY=
FEE_ADDRESS=
CONTRACT_ADDRESS=
```

Commands below run `scripts/deploy.ts` for picking the contracts to be deployed, and `hardhat.config.js` for picking the network to deploy.

```sh
# Deploy to local Hardhat network
yarn deploy

# Deploy to Ropsten testnet
yarn deploy --network ropsten

# Deploy to Avalanche local network (run Avash https://docs.avax.network/build/tools/avash)
yarn deploy --network local

# Deploy to Avalanche testnet Fuji
yarn deploy --network fuji

# Deploy to Avalanche mainnet
yarn deploy --network mainnet
```

Verify contract on Etherscan
```sh
# Update .env with deployed contract address
CONTRACT_ADDRESS_ROPSTEN=0x56E3a83B6eaaD7168AFea9e073633243847f1D09
CONTRACT_ADDRESS_FUJI=0x37de16466960419c7B6b54A94c89E826F5B8eedA

# Verify the contract on Etherscan
npx hardhat verify --network ropsten --constructor-args arguments.ts 0x56E3a83B6eaaD7168AFea9e073633243847f1D09 --show-stack-traces

# Verify the contract on Snowtrace
npx hardhat verify --network fuji --constructor-args arguments.ts 0x37de16466960419c7B6b54A94c89E826F5B8eedA --show-stack-traces

# Clear the cache and delete the artifacts if you get verification problems
npx hardhat clean

# make sure you have latest hardhat-etherscan plugin
yarn upgrade @nomiclabs/hardhat-etherscan --latest
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

