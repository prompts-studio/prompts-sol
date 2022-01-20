const { expect } = require('chai');
const { ethers } = require('hardhat');
const {
    constants,
    BN,
  } = require('@openzeppelin/test-helpers');
// const { ZERO_ADDRESS } = constants;

const name = 'Prompts';
const symbol = 'PNFT';
const memberLimit = 4;
const totalSupply = 2;
const mintFee = ethers.utils.parseUnits('0.001', 'ether');

const tokenId = 0;
const tokenURI = "https://...";
// const promptURI = "https://...";

// Avg blocktime is between 12 to 15 seconds https://ropsten.etherscan.io/chart/blocktime
// const promptDuration = Math.round((60 * 60 * 24) / 14); // 6171 blocks (~24 hrs)
const promptDuration = 86400; // 24 hrs
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

// async function blockNumber() {
//     const block = await ethers.provider.getBlock('latest')
//     return block.number
// }
async function blockTime() {
    const block = await ethers.provider.getBlock('latest')
    return block.timestamp
}
async function forceMine() {
    return ethers.provider.send('evm_mine', [])
}
async function moveForward(duration) {
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

        // const currentBlocknumber = await blockNumber();
        // console.log("deployment blocknumber", currentBlocknumber);
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

        it("deployer address in the allowlist", async function () {
            expect(await prompt.allowlist(owner.address)).to.equal(true);
        });

        it("mints a token with endsAt, members, and first contribution", async function () {
            let members = [owner.address, addr1.address, addr2.address];
            // const currentBlocknumber = await blockNumber();
            // console.log("mint blocknumber", currentBlocknumber);

            const blocktime = await blockTime();
            const endsAt = blocktime + promptDuration;
            // const endsAt = currentBlocknumber + promptDuration;
            // console.log("endsAt", endsAt);
            // console.log("blocktime", blocktime)
            // console.log("endsAt", endsAt)

            expect(await prompt.mint(owner.address, endsAt, members, contributionURI_0))
                .to.emit(prompt, "Minted")
                .withArgs(tokenId, owner.address, endsAt, members, contributionURI_0, owner.address);
        });

        it("cannot mint if not in allowlist", async function () {
            let members = [owner.address, addr1.address, addr2.address];
            const blocktime = await blockTime();
            const endsAt = blocktime + promptDuration;

            // Note that await is outside of expect for reverted to work
            await expect(prompt.connect(addr6).mint(addr6.address, endsAt, members, contributionURI_0))
                .to.be.reverted;
        });

        it("can mint if in allowlist", async function () {
            let members = [owner.address, addr1.address, addr2.address];
            const blocktime = await blockTime();
            const endsAt = blocktime + promptDuration;

            expect(await prompt.connect(addr1).mint(addr1.address, endsAt, members, contributionURI_0))
                .to.emit(prompt, "Minted")
                .withArgs(tokenId+1, addr1.address, endsAt, members, contributionURI_0, addr1.address);
        });

        it("cannot mint if reached token supply limit", async function () {
            let members = [owner.address, addr1.address, addr2.address];
            const blocktime = await blockTime();
            const endsAt = blocktime + promptDuration;

            await expect(prompt.mint(owner.address, endsAt, members, contributionURI_0))
                .to.be.revertedWith('reached token supply limit');
        });

        it("has token count", async function () {
            expect(await prompt.tokenCount()).to.equal(totalSupply);
        });

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
            const member = await prompt.connect(addr1);
            await expect(member.contribute(tokenId, contributionURI_1))
                .to.emit(prompt, "Contributed")
                .withArgs(tokenId, contributionURI_1, addr1.address);
        });

        it("cannot finalize if not ended and not completed", async function () {
            // not yet ended && not yet completed, so should be reverted
            const contributionCount = await prompt.contributionCount(tokenId);
            // console.log('contributionCount', contributionCount.toString());

            await expect(prompt.finalize(tokenId, tokenURI))
                .to.be.reverted;
        });

        it("a member cannot contribute more than once", async function () {
            const member = await prompt.connect(addr1);
            await expect(member.contribute(tokenId, contributionURI_1))
                .to.be.reverted;
        });

        it("another member can contribute", async function () {
            const member = await prompt.connect(addr2);
            await expect(member.contribute(tokenId, contributionURI_2))
                .to.emit(prompt, "Contributed")
                .withArgs(tokenId, contributionURI_2, addr2.address);
        });

        it("last member can contribute", async function () {
            const member = await prompt.connect(addr3);
            await expect(member.contribute(tokenId, contributionURI_2))
                .to.emit(prompt, "Contributed")
                .withArgs(tokenId, contributionURI_2, addr3.address);
        });

        it("non-members are not allowed to contribute", async function () {
            await expect(prompt.connect(addr5).contribute(tokenId, contributionURI_2))
                .to.be.reverted;
        });

        // it("non-members can contribute", async function () {
        //     const promptCallFromNonmember = await prompt.connect(addr3);
        //    await expect(promptCallFromNonmember.contribute(tokenId, contributionURI_2))
        //     .to.emit(prompt, "Contributed")
        //    .withArgs(tokenId, contributionId_2, contributionURI_2, addr3.address);
        // });

        it("is prompt completed?", async function () {
            const isCompleted = await prompt.isCompleted(tokenId);
            // const memberCount = await prompt.memberCount(tokenId);
            // console.log('isCompleted', isCompleted);
            // console.log('memberCount', memberCount);
            expect(isCompleted).to.equal(true);
        });

        it("get prompt", async function () {
            const myPrompt = await prompt.getPrompt(tokenId);
            console.log(myPrompt);

            const membersCheck = [owner.address, addr1.address, addr2.address, addr3.address];
            expect(myPrompt[0]).to.eql(owner.address);
            expect(myPrompt[1]).to.gt(await blockTime());
            expect(myPrompt[2]).to.eql(''); // tokenURI
            expect(myPrompt[3]).to.eql(membersCheck); // deep equality check for arrays
            // myPrompt[4] // contributions array
        });

        it("any member can finalize", async function () {
            // let blocktime = await blockTime();
            // console.log("blocktime", blocktime)
            await moveForward(promptDuration);
            // blocktime = await blockTime();
            // console.log("blocktime", blocktime)

            // const currentBlocknumber = await blockNumber();
            // console.log("finalize blocknumber", currentBlocknumber);

            // second member
            expect(await prompt.connect(addr1).finalize(tokenId, tokenURI))
                .to.emit(prompt, "Finalized")
                .withArgs(tokenId, tokenURI, owner.address);
        });

        it("is a finalized NFT", async function () {
            expect(await prompt.tokenURI(tokenId)).to.equal(tokenURI);
        });

    });
});
