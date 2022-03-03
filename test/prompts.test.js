const { ethers } = require('hardhat');
const { expect } = require('chai');
// const {
//     constants,
//     BN,
// } = require('@openzeppelin/test-helpers');
// const { ZERO_ADDRESS } = constants;

const name = 'Prompts';
const symbol = 'PNFT';
const memberLimit = 3;
const totalSupply = 2;
const mintCost = ethers.utils.parseUnits('0.01', 'ether');

const tokenId = 0;
const tokenId_1 = 1;
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
const contributionPrice_0 = ethers.utils.parseUnits('0.25', 'ether');
const contributionPrice_1 = ethers.utils.parseUnits('0.25', 'ether');
const contributionPrice_2 = ethers.utils.parseUnits('0.25', 'ether');
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

let members;

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
        const feeAddress = addr6.address;

        members = [owner.address, addr1.address, addr2.address];

        prompt = await Prompt.deploy(name, symbol, memberLimit, totalSupply, mintCost, feeAddress);
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

        it("has deployment parameters: memberLimit, totalSupply, mintCost, feeAddress", async function () {
            expect(await prompt.memberLimit()).to.equal(memberLimit);
            expect(await prompt.totalSupply()).to.equal(totalSupply);
            expect(await prompt.mintCost()).to.equal(mintCost);
            // expect(await prompt.feeAddress()).to.equal(owner.address);
        });
    });

    describe("Prompt", function () {

        it("deployer address in the allowlist", async function () {
            expect(await prompt.allowlist(owner.address)).to.equal(true);
        });

        it("creates prompt with endsAt, members, first contribution, and price", async function () {
            // const currentBlocknumber = await blockNumber();
            // console.log("mint blocknumber", currentBlocknumber);
            const blocktime = await blockTime();
            const endsAt = blocktime + promptDuration;
            // const endsAt = currentBlocknumber + promptDuration;
            // console.log("endsAt", endsAt);
            // console.log("blocktime", blocktime)
            // console.log("endsAt", endsAt)

            expect(await prompt.createPrompt(endsAt, members, contributionURI_0, contributionPrice_0))
                .to.emit(prompt, "PromptCreated")
                .withArgs(tokenId, endsAt, members, contributionURI_0, contributionPrice_0, owner.address);
        });

        it("cannot create prompt if not in allowlist", async function () {
            const blocktime = await blockTime();
            const endsAt = blocktime + promptDuration;

            // Note that await is outside of expect for reverted to work
            await expect(prompt.connect(addr6).createPrompt(endsAt, members, contributionURI_0, contributionPrice_0))
                .to.be.reverted;
        });

        it("can create prompt if in allowlist", async function () {
            const blocktime = await blockTime();
            const endsAt = blocktime + promptDuration;

            expect(await prompt.connect(addr1).createPrompt(endsAt, members, contributionURI_1, contributionPrice_1))
                .to.emit(prompt, "PromptCreated")
                .withArgs(tokenId_1, endsAt, members, contributionURI_1, contributionPrice_1, addr1.address);
        });

        it("owner contributed token 0", async function () {
            const tokenId_big = ethers.BigNumber.from(tokenId);
            const tokens = [tokenId_big];
            expect(await prompt.getContributedTokens(owner.address)).to.eql(tokens);
        });

        // Testing contribution to multiple token
        // it("can mint one more", async function () {
        //     const blocktime = await blockTime();
        //     const endsAt = blocktime + promptDuration;

        //     expect(await prompt.mint(owner.address, endsAt, members, contributionURI_0))
        //         .to.emit(prompt, "Minted")
        //         .withArgs(tokenId_1, owner.address, endsAt, members, contributionURI_0, owner.address);
        // });

        // it("owner contributed tokens 0 and 1", async function () {
        //     const tokenId_big = ethers.BigNumber.from(tokenId);
        //     const tokenId_1_big = ethers.BigNumber.from(tokenId_1);
        //     const tokens = [tokenId_big, tokenId_1_big];
        //     expect(await prompt.getContributedTokens(owner.address)).to.eql(tokens);
        // });

        it("cannot create prompt if reached supply limit", async function () {
            const blocktime = await blockTime();
            const endsAt = blocktime + promptDuration;

            await expect(prompt.createPrompt(endsAt, members, contributionURI_0, contributionPrice_0))
                .to.be.revertedWith('reached token supply limit');
        });

        it("has token count", async function () {
            expect(await prompt.tokenCount()).to.equal(totalSupply);
        });

        it("has initially 3 members", async function () {
            expect(await prompt.memberCount(tokenId)).to.be.equal(3);
        });

        // it("owner can add a new member", async function () {
        //     await expect(prompt.addMember(tokenId, addr3.address))
        //         .to.emit(prompt, "MemberAdded")
        //         .withArgs(tokenId, addr3.address);
        // });

        // it("cannot add member if limit is reached", async function () {
        //     await expect(prompt.addMember(tokenId, addr4.address))
        //         .to.be.reverted;
        // });

        // it("has total 4 members", async function () {
        //     expect(await prompt.memberCount(tokenId)).to.be.equal(4);
        // });

        it("a member can contribute", async function () {
            const member = await prompt.connect(addr1);
            await expect(member.contribute(tokenId, contributionURI_1, contributionPrice_1))
                .to.emit(prompt, "Contributed")
                .withArgs(tokenId, contributionURI_1, addr1.address, contributionPrice_1);
        });

        it("cannot mint if not ended and not completed", async function () {
            // not yet ended && not yet completed, so should be reverted
            const contributionCount = await prompt.contributionCount(tokenId);
            // console.log('contributionCount', contributionCount.toString());

            await expect(prompt.mint(tokenId, tokenURI))
                .to.be.reverted;
        });

        // it("cannot mint if not the last contribution", async function () {
        //     const member = await prompt.connect(addr3);
        //     await expect(member.contributeAndFinalize(tokenId, contributionURI_2, tokenURI))
        //         .to.be.reverted;
        // });

        it("a member cannot contribute more than once", async function () {
            const member = await prompt.connect(addr1);
            await expect(member.contribute(tokenId, contributionURI_1, contributionPrice_1))
                .to.be.reverted;
        });

        it("non-members are not allowed to contribute", async function () {
            await expect(prompt.connect(addr5).contribute(tokenId, contributionURI_2, contributionPrice_2))
                .to.be.reverted;
        });

        it("another member can contribute", async function () {
            const member = await prompt.connect(addr2);
            await expect(member.contribute(tokenId, contributionURI_2, contributionPrice_2))
                .to.emit(prompt, "Contributed")
                .withArgs(tokenId, contributionURI_2, addr2.address, contributionPrice_2);
        });

        it("get prompt", async function () {
            const myPrompt = await prompt.getPrompt(tokenId);
            console.log(myPrompt);

            // expect(myPrompt[0]).to.eql(owner.address); // owner
            expect(myPrompt[0]).to.gt(await blockTime()); //endsAt
            expect(myPrompt[1]).to.eql(''); // tokenURI
            expect(myPrompt[2]).to.eql(members); // deep equality check for arrays
            // myPrompt[3] // contributions array
        });

        // it("last member can contribute", async function () {
        //     const member = await prompt.connect(addr3);
        //     await expect(member.contribute(tokenId, contributionURI_3, contributionPrice_3))
        //         .to.emit(prompt, "Contributed")
        //         .withArgs(tokenId, contributionURI_3, addr3.address, contributionPrice_3);
        // });

        it("is prompt completed?", async function () {
            const isCompleted = await prompt.isCompleted(tokenId);
            // const memberCount = await prompt.memberCount(tokenId);
            // console.log('isCompleted', isCompleted);
            // console.log('memberCount', memberCount);
            expect(isCompleted).to.equal(true);
        });

        it("anyone can mint if prompt completed", async function () {
            const myPrompt = await prompt.getPrompt(tokenId);
            const contributions = myPrompt[3];

            let totalPrice = ethers.BigNumber.from(0);
            contributions.forEach(c => {
                totalPrice = totalPrice.add(ethers.BigNumber.from(c.price));
            });
            console.log('totalPrice', ethers.utils.formatEther(totalPrice));

            const mintCost = ethers.BigNumber.from(await prompt.mintCost());
            console.log('mintCost', ethers.utils.formatEther(mintCost));

            const total = totalPrice.add(mintCost);
            console.log('total', ethers.utils.formatEther(total));

            // minter
            const addr5Balance = await addr5.getBalance();
            console.log('addr5Balance', ethers.utils.formatEther(addr5Balance));

            // contributors
            const ownerBalance = await owner.getBalance();
            console.log(owner.address, ethers.utils.formatEther(ownerBalance));

            const addr1Balance = await addr1.getBalance();
            console.log(addr1.address, ethers.utils.formatEther(addr1Balance));

            const addr2Balance = await addr2.getBalance();
            console.log(addr2.address, ethers.utils.formatEther(addr2Balance));

            // feeAddress
            const addr6Balance = await addr6.getBalance();
            console.log(addr6.address, ethers.utils.formatEther(addr6Balance));

            const someone = await prompt.connect(addr5);
            expect(await someone.mint(tokenId, tokenURI, {value: total}))
                .to.emit(prompt, "Minted")
                .withArgs(tokenId, tokenURI, addr5.address);
        });

        it("buyer and member balances check", async function () {
            // minter
            const addr5Balance = await addr5.getBalance();
            console.log('addr5Balance', ethers.utils.formatEther(addr5Balance));

            // contributors
            const ownerBalance = await owner.getBalance();
            console.log(owner.address, ethers.utils.formatEther(ownerBalance));

            const addr1Balance = await addr1.getBalance();
            console.log(addr1.address, ethers.utils.formatEther(addr1Balance));

            const addr2Balance = await addr2.getBalance();
            console.log(addr2.address, ethers.utils.formatEther(addr2Balance));

            // feeAddress
            const addr6Balance = await addr6.getBalance();
            console.log(addr6.address, ethers.utils.formatEther(addr6Balance));
        });

        it("buyer is the owner", async function () {
            let nftOwner = await prompt.ownerOf(tokenId);
            expect(nftOwner).to.equal(addr5.address);
        });

        // ReservedAddress check, if exists only mint to this address

        it("addr1 contributed token 1 and 0", async function () {
            // in reverse order because add1 first minted & contr token_1 then contr token_0
            const tokenId_1_big = ethers.BigNumber.from(tokenId_1);
            const tokenId_big = ethers.BigNumber.from(tokenId);
            const tokens = [tokenId_1_big, tokenId_big];
            expect(await prompt.getContributedTokens(addr1.address)).to.eql(tokens);
        });
    });
});
