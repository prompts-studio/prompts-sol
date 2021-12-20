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

    const name = 'Prompts';
    const symbol = 'pNFT';
    const memberLimit = 3;
    const supply = 10000;
    const mintFee = ethers.utils.parseUnits('0.1', 'ether');
    const feeAddress = "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC";

    const Prompt = await ethers.getContractFactory("Prompts");
    const prompt = await Prompt.deploy(name, symbol, memberLimit, supply, mintFee, feeAddress);
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
