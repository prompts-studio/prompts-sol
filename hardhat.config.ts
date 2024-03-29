import 'dotenv/config'
import { task } from "hardhat/config"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { BigNumber } from "ethers"
import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-web3"
import "@nomiclabs/hardhat-etherscan"
import "hardhat-gas-reporter"

// When using the hardhat network, you may choose to fork Fuji or Avalanche Mainnet
// This will allow you to debug contracts using the hardhat network while keeping the current network state
// To enable forking, turn one of these booleans on, and then run your tasks/scripts using ``--network hardhat``
// For more information go to the hardhat guide
// https://hardhat.org/hardhat-network/
// https://hardhat.org/guides/mainnet-forking.html
const FORK_FUJI = false
const FORK_MAINNET = false
const forkingData = FORK_FUJI ? {
  url: 'https://api.avax-test.network/ext/bc/C/rpc',
} : FORK_MAINNET ? {
  url: 'https://api.avax.network/ext/bc/C/rpc'
} : undefined

// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

// Replace this private key with your Ropsten account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts
const PRIVATE_KEY = process.env.PRIVATE_KEY;

task("accounts", "Prints the list of accounts", async (args, hre): Promise<void> => {
  const accounts: SignerWithAddress[] = await hre.ethers.getSigners()
  accounts.forEach((account: SignerWithAddress): void => {
    console.log(account.address)
  })
})

task("balances", "Prints the list of AVAX account balances", async (args, hre): Promise<void> => {
  const accounts: SignerWithAddress[] = await hre.ethers.getSigners()
  for(const account of accounts){
    const balance: BigNumber = await hre.ethers.provider.getBalance(
      account.address
    );
    console.log(`${account.address} has balance ${balance.toString()}`);
  }
})

task("verify", "Verifies the contract on Etherscan", async (args, hre): Promise<void> => {
  const name = "Exquisite Corpse";
  const symbol = "EXC";
  const memberLimit = 3;
  const totalSupply = 1000;
  const sessionLimitPerAccount = 1;
  const baseMintFee = hre.ethers.utils.parseUnits("0.01", "ether");
  const mintFeeRate = 10;
  const feeAddress = process.env.FEE_ADDRESS;

  await hre.run("verify:verify", {
    address: process.env.CONTRACT_ADDRESS, // Deployed contract address
    constructorArguments: [
      name,
      symbol,
      memberLimit,
      totalSupply,
      sessionLimitPerAccount,
      baseMintFee,
      mintFeeRate,
      feeAddress
    ],
  });
})

export default {
  solidity: {
    compilers: [
      {
        version: "0.5.16"
      },
      {
        version: "0.6.2"
      },
      {
        version: "0.6.4"
      },
      {
        version: "0.7.0"
      },
      {
        version: "0.8.0",
      },
      {
        version: "0.8.11",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          }
        }
      },
      {
        version: "0.8.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          }
        }
      }
    ]
  },
  networks: {
    hardhat: {
      gasPrice: 225000000000,
      chainId: !forkingData ? 43112 : undefined, //Only specify a chainId if we are not forking
      forking: forkingData
    },
    local: {
      url: 'http://localhost:9650/ext/bc/C/rpc',
      gasPrice: 225000000000,
      chainId: 43112,
      accounts: [
        "0x56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027",
        "0x7b4198529994b0dc604278c99d153cfd069d594753d471171a1d102a10438e07",
        "0x15614556be13730e9e8d6eacc1603143e7b96987429df8726384c2ec4502ef6e",
        "0x31b571bf6894a248831ff937bb49f7754509fe93bbd2517c9c73c4144c0e97dc",
        "0x6934bef917e01692b789da754a0eae31a8536eb465e7bff752ea291dad88c675",
        "0xe700bdbdbc279b808b1ec45f8c2370e4616d3a02c336e68d85d4668e08f53cff",
        "0xbbc2865b76ba28016bc2255c7504d000e046ae01934b04c694592a6276988630",
        "0xcdbfd34f687ced8c6968854f8a99ae47712c4f4183b78dcc4a903d1bfe8cbf60",
        "0x86f78c5416151fe3546dece84fda4b4b1e36089f2dbc48496faf3a950f16157c",
        "0x750839e9dbbd2a0910efe40f50b2f3b2f2f59f5580bb4b83bd8c1201cf9a010a"
      ]
    },
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      gasPrice: 225000000000,
      chainId: 43113,
      accounts: [`${PRIVATE_KEY}`]
    },
    avalanche: {
      url: 'https://api.avax.network/ext/bc/C/rpc',
      gasPrice: 225000000000,
      chainId: 43114,
      accounts: [`${PRIVATE_KEY}`]
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      chainId: 80001,
      accounts: [`${PRIVATE_KEY}`]
    },
    polygon: {
      url: "https://polygon-rpc.com/",
      chainId: 137,
      accounts: [`${PRIVATE_KEY}`]
    },
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${PRIVATE_KEY}`]
    },
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${PRIVATE_KEY}`]
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${PRIVATE_KEY}`]
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${PRIVATE_KEY}`]
    }
  },
  etherscan: {
    apiKey:
    // process.env.ETHERSCAN_KEY
    {
      mainnet: process.env.ETHERSCAN_KEY,
      ropsten: process.env.ETHERSCAN_KEY,
      rinkeby: process.env.ETHERSCAN_KEY,
      goerli: process.env.ETHERSCAN_KEY,
      avalanche: process.env.SNOWTRACE_KEY,
      avalancheFujiTestnet: process.env.SNOWTRACE_KEY,
      polygonMumbai: process.env.POLYGONSCAN_KEY,
      polygon: process.env.POLYGONSCAN_KEY,
    }
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 30
  }
}