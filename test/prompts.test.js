const { expect } = require('chai');
const { ethers } = require('hardhat');
// const {
//     constants,
//     BN,
//   } = require('@openzeppelin/test-helpers');
// const { ZERO_ADDRESS } = constants;

const name = 'Prompts';
const symbol = 'PNFT';
const tokenId = 0;
const tokenURI = "https://...";
const promptURI = "https://...";
const promptEnd = 10;
const contributionId_0 = 0;
const contributionId_1 = 1;
const contributionId_2 = 2;
const contributionURI_0 = "https://zero...";
const contributionURI_1 = "https://one...";
const contributionURI_2 = "https://two...";
const contributionURIs = [contributionURI_0, contributionURI_1];

let Prompt;
let prompt;
let owner;
let addr1;
let addr2;
let addr3;
let addrs;

describe('Prompt contract', function () {

    before(async function () {
        Prompt = await ethers.getContractFactory(name);
        [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

        prompt = await Prompt.deploy(name, symbol);
        await prompt.deployed();
    });

    // beforeEach(async function () {
    // });

    describe("Deployment", function () {
        it("has a name", async function () {
            expect(await prompt.name()).to.equal(name);
        });

        it("has a symbol", async function () {
            expect(await prompt.symbol()).to.equal(symbol);
        });

        it("has an owner", async function () {
            expect(await prompt.owner()).to.equal(owner.address);
        });
    });

    describe("Prompt", function () {

        it("mints a token", async function () {
            expect(await prompt.mint(owner.address, promptURI, promptEnd))
            .to.emit(prompt, "Minted")
            .withArgs(tokenId, owner.address, promptURI, owner.address, promptEnd);
        });

        it("is an empty NFT", async function () {
            expect(await prompt.tokenURI(tokenId)).to.equal('');
        });

        it("minter is the owner", async function () {
            expect(await prompt.isOwner(tokenId, owner.address)).to.be.true;
        });

        it("owner can add a new member", async function () {
            await expect(prompt.addMember(tokenId, addr1.address))
                .to.emit(prompt, "MemberAdded")
                .withArgs(tokenId, addr1.address);
        });

        it("owner can add another member", async function () {
            await expect(prompt.addMember(tokenId, addr2.address))
                .to.emit(prompt, "MemberAdded")
                .withArgs(tokenId, addr2.address);
        });

        it("has multiple members", async function () {
            expect(await prompt.memberCount(tokenId)).to.be.equal(2);
        });

        it("a member can contribute", async function () {
            const promptCallFromMember = await prompt.connect(addr1);
            await expect(promptCallFromMember.contribute(tokenId, contributionURI_0))
            .to.emit(prompt, "Contributed")
            .withArgs(tokenId, contributionId_0, contributionURI_0, addr1.address);
        });

        it("another member can contribute", async function () {
            const promptCallFromOther = await prompt.connect(addr2);
            await expect(promptCallFromOther.contribute(tokenId, contributionURI_1))
                .to.emit(prompt, "Contributed")
                .withArgs(tokenId, contributionId_1, contributionURI_1, addr2.address);
        });

        it("non-members cannot contribute", async function () {
            await expect(prompt.connect(addr3).contribute(tokenId, contributionURI_2))
            .to.be.reverted;
        });

        // it("a non-member can contribute", async function () {
        //     const promptCallFromNonmember = await prompt.connect(addr3);
        //    await expect(promptCallFromNonmember.contribute(tokenId, contributionURI_2))
        //     .to.emit(prompt, "Contributed")
        //    .withArgs(tokenId, contributionId_2, contributionURI_2, addr3.address);
        // });

        it("get all contribution URIs", async function () {
            expect(await prompt.getContributions(tokenId))
            .to.eql(contributionURIs); // deep equality check for arrays
        });

        it("owner can fill NFT / set tokenURI", async function () {
            expect(await prompt.fill(tokenId, tokenURI))
            .to.emit(prompt, "Filled")
            .withArgs(tokenId, tokenURI);
        });

        it("is a filled NFT", async function () {
            expect(await prompt.tokenURI(tokenId)).to.equal(tokenURI);
        });

    });
});
