const { expect } = require('chai');
const { ethers } = require('hardhat');
// const {
//     constants,
//     BN,
//   } = require('@openzeppelin/test-helpers');
// const { ZERO_ADDRESS } = constants;

const name = 'Prompts';
const symbol = 'PNFT';
const memberLimit = 3;
const totalSupply = 1;
const mintFee = ethers.utils.parseUnits('0.001', 'ether');

const tokenId = 0;
const tokenURI = "https://...";
// const promptURI = "https://...";
const promptDuration = 86400; // 1 day
const contributionId_0 = 0;
const contributionId_1 = 1;
const contributionId_2 = 2;
const contributionURI_0 = "https://zero...";
const contributionURI_1 = "https://one...";
const contributionURI_2 = "https://two...";
const contributionURIs = [contributionURI_0, contributionURI_1, contributionURI_2];

let Prompt;
let prompt;
let owner;
let addr1;
let addr2;
let addr3;
let addr4;
let addr5;
let addr6;
let addrs;

async function blockTime () {
    const block = await ethers.provider.getBlock('latest')
    return block.timestamp
}
async function forceMine () {
    return ethers.provider.send('evm_mine', [])
}
async function moveForward (duration) {
    const blocktime = await blockTime()
    const goToTime = blocktime + duration
    await ethers.provider.send('evm_setNextBlockTimestamp', [goToTime])
    await forceMine()
    await blockTime()
    return true
}

describe('Prompt contract', function () {

    before(async function () {
        Prompt = await ethers.getContractFactory(name);
        [owner, addr1, addr2, addr3, addr4, addr5, addr6, ...addrs] = await ethers.getSigners();
        const feeAddress = owner.address;

        prompt = await Prompt.deploy(name, symbol, memberLimit, totalSupply, mintFee, feeAddress);
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

        it("has deployment parameters: memberLimit, totalSupply, mintFee, feeAddress", async function () {
            expect(await prompt.memberLimit()).to.equal(memberLimit);
            expect(await prompt.totalSupply()).to.equal(totalSupply);
            expect(await prompt.mintFee()).to.equal(mintFee);
            expect(await prompt.feeAddress()).to.equal(owner.address);
        });
    });

    describe("Prompt", function () {

        it("mints a token with endsAt, members, and first contribution", async function () {
            let members = [owner.address, addr1.address, addr2.address];
            const blocktime = await blockTime();
            const endsAt = blocktime + promptDuration;
            // console.log("blocktime", blocktime)
            // console.log("endsAt", endsAt)

            expect(await prompt.mint(owner.address, endsAt, members, contributionURI_0))
                .to.emit(prompt, "Minted")
                .withArgs(tokenId, owner.address, endsAt, members, contributionURI_0, owner.address);
        });

        // it("cannot mint if reached token supply limit", async function () {
        //     let members = [owner.address, addr1.address, addr2.address];
        //     const blocktime = await blockTime();
        //     const endsAt = blocktime + promptDuration;

        //     expect(await prompt.mint(owner.address, endsAt, members, contributionURI_0))
        //         .should.be.rejectedWith('reached token supply limit');
        // });

        it("is an empty NFT", async function () {
            expect(await prompt.tokenURI(tokenId)).to.equal('');
        });

        it("minter is the owner", async function () {
            let nftOwner = await prompt.ownerOf(tokenId);
            expect(nftOwner).to.equal(owner.address);
        });

        it("has initially 3 members", async function () {
            expect(await prompt.memberCount(tokenId)).to.be.equal(3);
        });

        it("owner can add a new member", async function () {
            await expect(prompt.addMember(tokenId, addr3.address))
                .to.emit(prompt, "MemberAdded")
                .withArgs(tokenId, addr3.address);
        });

        it("cannot add member if limit is reached", async function () {
            await expect(prompt.addMember(tokenId, addr4.address))
                .to.be.reverted;
        });

        it("has total 4 members", async function () {
            expect(await prompt.memberCount(tokenId)).to.be.equal(4);
        });

        it("a member can contribute", async function () {
            const promptMember = await prompt.connect(addr1);
            await expect(promptMember.contribute(tokenId, contributionURI_1))
            .to.emit(prompt, "Contributed")
            .withArgs(tokenId, contributionURI_1, addr1.address);
        });

        it("another member can contribute", async function () {
            const promptMember2 = await prompt.connect(addr2);
            await expect(promptMember2.contribute(tokenId, contributionURI_2))
                .to.emit(prompt, "Contributed")
                .withArgs(tokenId, contributionURI_2, addr2.address);
        });

        it("non-members not allowed to contribute", async function () {
            await expect(prompt.connect(addr5).contribute(tokenId, contributionURI_2))
                .to.be.reverted;
        });

        // it("non-members can contribute", async function () {
        //     const promptCallFromNonmember = await prompt.connect(addr3);
        //    await expect(promptCallFromNonmember.contribute(tokenId, contributionURI_2))
        //     .to.emit(prompt, "Contributed")
        //    .withArgs(tokenId, contributionId_2, contributionURI_2, addr3.address);
        // });

        // it("get all contribution URIs", async function () {
        //     expect(await prompt.contributions(tokenId))
        //     .to.eql(contributionURIs); // deep equality check for arrays
        // });

        it("get prompt members", async function () {
            let members = [owner.address, addr1.address, addr2.address];
            expect(await prompt.prompts[tokenId].members())
            .to.eql(members); // deep equality check for arrays
        });

        it("owner can finalize (set tokenURI) and transfer to an address", async function () {
            // let blocktime = await blockTime();
            // console.log("blocktime", blocktime)
            await moveForward(promptDuration);
            // blocktime = await blockTime();
            // console.log("blocktime", blocktime)

            expect(await prompt.finalize(tokenId, tokenURI, addr6.address))
            .to.emit(prompt, "Finalized")
            .withArgs(tokenId, tokenURI, addr6.address);
        });

        it("is a finalized NFT", async function () {
            expect(await prompt.tokenURI(tokenId)).to.equal(tokenURI);
        });

        it("finalized address is the new owner", async function () {
            let nftOwner = await prompt.ownerOf(tokenId);
            expect(nftOwner).to.equal(addr6.address);
        });
    });
});
