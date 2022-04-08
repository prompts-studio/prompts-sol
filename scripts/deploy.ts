import {
  Contract,
  ContractFactory
} from "ethers"
import { ethers } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

const main = async(): Promise<any> => {
    const [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    const accounts: SignerWithAddress[] = await ethers.getSigners()
    accounts.forEach((account: SignerWithAddress): void => {
        console.log(account.address)
    })

    console.log("Deployer account:", owner.address);
    console.log("Account balance:", (await owner.getBalance()).toString());

    const name = "Prompts";
    const symbol = "pNFT";
    const memberLimit = 3;
    const totalSupply = 120;
    const promptLimitPerAccount = 3;
    const baseMintFee = ethers.utils.parseUnits("0.001", "ether");
    const mintFee = 5;
    const feeAddress = process.env.FEE_ADDRESS;

    const Prompt = await ethers.getContractFactory("Prompts");
    const prompt = await Prompt.deploy(
                    name,
                    symbol,
                    memberLimit,
                    totalSupply,
                    promptLimitPerAccount,
                    baseMintFee,
                    mintFee,
                    feeAddress
                );
    await prompt.deployed(); // waiting for the contract to be deployed
    console.log("Deployed contract address:", prompt.address);

    // const name = "Waltz";
    // const Contract = await ethers.getContractFactory(name);
    // const contract = await Contract.deploy();
    // await contract.deployed(); // waiting for the contract to be deployed
    // console.log("Deployed contract address:", contract.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    });
