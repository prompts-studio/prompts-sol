import {
  Contract,
  ContractFactory
} from "ethers"
import { ethers } from "hardhat"

const main = async(): Promise<any> => {
    // const [deployer] = await ethers.getSigners();
    const [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", owner.address);
    console.log("Account balance:", (await owner.getBalance()).toString());

    const Prompt = await ethers.getContractFactory("Prompts");
    const prompt = await Prompt.deploy("Prompt", "PROMPT");
    console.log("Deployed contract address:", prompt.address);

    // const Coin: ContractFactory = await ethers.getContractFactory("ExampleERC20")
    // const coin: Contract = await Coin.deploy()
    // await coin.deployed()
    // console.log(`Coin deployed to: ${coin.address}`)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    });
