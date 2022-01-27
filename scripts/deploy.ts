import {
  Contract,
  ContractFactory
} from "ethers"
import { ethers } from "hardhat"

const main = async(): Promise<any> => {
    // const [deployer] = await ethers.getSigners();
    const [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    console.log("Deployer account:", owner.address);
    console.log("Account balance:", (await owner.getBalance()).toString());

    const name = "Prompts";
    const symbol = "pNFT";
    const memberLimit = 3;
    const supply = 120;
    const mintFee = ethers.utils.parseUnits("0.001", "ether");
    const feeAddress = "0x0249d0d547F5F4bb33790E04A503ae1c6822b8B6";

    const Prompt = await ethers.getContractFactory("Prompts");
    const prompt = await Prompt.deploy(name, symbol, memberLimit, supply, mintFee, feeAddress);
    await prompt.deployed(); // waiting for the contract to be deployed
    console.log("Deployed contract address:", prompt.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    });
