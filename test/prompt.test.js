const { ethers } = require('hardhat');
const { expect } = require('chai');

const name = 'Prompt';
const symbol = 'pNFT';
const memberLimit = 3;
const totalSupply = 2;
const sessionLimitPerAccount = 1;
const baseMintFee = ethers.utils.parseUnits('0.01', 'ether');
const mintFeeRate = 10; // percent

const contractURI = "https://exquisitecorpse.prompts.studio/contract-metadata.json";

const tokenId = 0;
const tokenId_1 = 1;
const tokenURI = "https://zero...";
const tokenURI_1 = "https://one...";
const tokenURI_2 = "https://two...";

const duration = 86400; // 24 hrs
const contributionURI_0 = "https://zero...";
const contributionURI_1 = "https://one...";
const contributionURI_2 = "https://two...";
const contributionPrice_0 = ethers.utils.parseUnits('0.25', 'ether');
const contributionPrice_1 = ethers.utils.parseUnits('0.25', 'ether');
const contributionPrice_2 = ethers.utils.parseUnits('0.25', 'ether');
const contributionPrice_1_new = ethers.utils.parseUnits('0.30', 'ether');
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
let addr7;
let addrs;

let members;
let reservedAddress;

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
async function calculatePayment(tokenId) {
    const mySession = await prompt.getSession(tokenId);
    const contributions = mySession[3];

    let totalPrice = ethers.BigNumber.from(0);
    let mintFee = ethers.BigNumber.from(await prompt.baseMintFee());
    const mintFeeRate = await prompt.mintFeeRate(); // ethers.BigNumber.from(await prompt.mintFeeRate());
    // console.log('mintFeeRate', ethers.utils.formatEther(mintFeeRate));

    contributions.forEach(c => {
        totalPrice = totalPrice.add(ethers.BigNumber.from(c.price));
    });
    // console.log('totalPrice', ethers.utils.formatEther(totalPrice));

    if (totalPrice > 0) {
        mintFee = totalPrice.mul(mintFeeRate).div(100);
    }
    return totalPrice.add(mintFee);
}

describe('Prompt contract', function () {

    before(async function () {
        Prompt = await ethers.getContractFactory(name);
        [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, ...addrs] = await ethers.getSigners();
        const feeAddress = addr6.address;

        members = [owner.address, addr1.address, addr2.address];
        reservedAddress = addr5.address;

        prompt = await Prompt.deploy(
                    name,
                    symbol,
                    memberLimit,
                    totalSupply,
                    sessionLimitPerAccount,
                    baseMintFee,
                    mintFeeRate,
                    feeAddress
                );
        await prompt.deployed();
    });

    describe("Deployment", function () {
        it("has a name", async function () {
            expect(await prompt.name()).to.equal(name);
        });

        it("has a symbol", async function () {
            expect(await prompt.symbol()).to.equal(symbol);
        });

        // it("has an owner", async function () {
        //     expect(await prompt.owner()).to.equal(owner.address);
        // });

        it("has deployment parameters: memberLimit, totalSupply, baseMintFee, mintFeeRate, feeAddress", async function () {
            expect(await prompt.memberLimit()).to.equal(memberLimit);
            expect(await prompt.totalSupply()).to.equal(totalSupply);
            expect(await prompt.sessionLimitPerAccount()).to.equal(sessionLimitPerAccount);
            expect(await prompt.baseMintFee()).to.equal(baseMintFee);
            expect(await prompt.mintFeeRate()).to.equal(mintFeeRate);
            // expect(await prompt.feeAddress()).to.equal(owner.address); // not public, so not testable
        });

        it("has contractURI", async function () {
            expect(await prompt.contractURI()).to.equal(contractURI);
        })
    });

    describe("Session create, contribute, mint", function () {

        it("deployer address in the allowlist", async function () {
            expect(await prompt.allowlist(owner.address)).to.equal(true);
        });

        it("creates session with reservedAddress, members, first contribution, and price", async function () {
            const blocktime = await blockTime();

            expect(await prompt.createSession(reservedAddress, members, contributionURI_0, contributionPrice_0))
                .to.emit(prompt, "SessionCreated")
                .withArgs(tokenId, owner.address, reservedAddress);
                // .withArgs(tokenId, members, contributionURI_0, contributionPrice_0, owner.address, reservedAddress);
        });

        it("cannot create a session if the account reached their sessionLimitPerAccount", async function () {
            const blocktime = await blockTime();

            await expect(prompt.createSession(reservedAddress, members, contributionURI_0, contributionPrice_0))
                .to.be.reverted;
        });

        it("cannot create session if in the allowlist", async function () {
            const blocktime = await blockTime();

            await expect(prompt.connect(addr6).createSession(reservedAddress, members, contributionURI_0, contributionPrice_0))
                .to.be.reverted;
        });

        it("can create session (without reserverAddress) if in the allowlist", async function () {
            const blocktime = await blockTime();
            const emptyReservedAddress = ethers.constants.AddressZero; // "0x0000000000000000000000000000000000000000";

            expect(await prompt.connect(addr1).createSession(emptyReservedAddress, members, contributionURI_1, contributionPrice_1))
                .to.emit(prompt, "SessionCreated")
                .withArgs(tokenId_1, addr1.address, emptyReservedAddress);
                // .withArgs(tokenId_1, members, contributionURI_1, contributionPrice_1, addr1.address, emptyReservedAddress);
        });

        it("owner contributed token 0", async function () {
            const tokenId_big = ethers.BigNumber.from(tokenId);
            const tokens = [tokenId_big];
            expect(await prompt.getContributedTokens(owner.address)).to.eql(tokens);
        });

        it("cannot create session if reached supply limit", async function () {
            const blocktime = await blockTime();

            await expect(prompt.connect(addr2).createSession(reservedAddress, members, contributionURI_0, contributionPrice_0))
                .to.be.revertedWith('reached token supply limit');
        });

        it("has token count", async function () {
            expect(await prompt.tokenCount()).to.equal(totalSupply);
        });

        it("has initially 3 members", async function () {
            expect(await prompt.memberCount(tokenId)).to.be.equal(3);
        });

        it("a member can contribute", async function () {
            const member = await prompt.connect(addr1);
            await expect(member.contribute(tokenId, contributionURI_1, contributionPrice_1))
                .to.emit(prompt, "Contributed")
                .withArgs(tokenId, contributionURI_1, addr1.address, contributionPrice_1);
        });

        it("cannot mint if not ended and not completed", async function () {
            // not yet ended && not yet completed, so should be reverted
            // const contributionCount = await prompt.contributionCount(tokenId);
            // console.log('contributionCount', contributionCount.toString());

            await expect(prompt.mint(tokenId))
                .to.be.reverted;
        });

        it("a member cannot contribute more than once", async function () {
            const member = await prompt.connect(addr1);
            await expect(member.contribute(tokenId, contributionURI_1, contributionPrice_1))
                .to.be.reverted;
        });

        it("contributor can set new price", async function () {
            const member = await prompt.connect(addr1);
            await expect(member.setPrice(tokenId, contributionPrice_1_new))
                .to.emit(prompt, "PriceSet")
                .withArgs(tokenId, addr1.address, contributionPrice_1_new);
        });

        it("non-members are not allowed to contribute", async function () {
            await expect(prompt.connect(addr5).contribute(tokenId, contributionURI_2, contributionPrice_2))
                .to.be.reverted;
        });

        it("cannot set new price if member but not contributed", async function () {
            const member = await prompt.connect(addr2);
            await expect(member.setPrice(tokenId, contributionPrice_1_new))
                .to.be.reverted;
        });

        it("cannot set new price if not member", async function () {
            const nonmember = await prompt.connect(addr5);
            await expect(nonmember.setPrice(tokenId, contributionPrice_1_new))
                .to.be.reverted;
        });

        it("another member can contribute", async function () {
            const member = await prompt.connect(addr2);
            await expect(member.contribute(tokenId, contributionURI_2, contributionPrice_2))
                .to.emit(prompt, "Contributed")
                .withArgs(tokenId, contributionURI_2, addr2.address, contributionPrice_2);
        });

        it("get a session that is not yet minted ", async function () {
            const mySession = await prompt.getSession(tokenId);

            expect(mySession[0]).to.eql("0x0000000000000000000000000000000000000000"); // owner, not yet minted
            expect(mySession[1]).to.eql(''); // tokenURI, not yet minted
            expect(mySession[2]).to.eql(members); // deep equality check for arrays
            // mySession[3] // contributions array
        });

        it("is session completed?", async function () {
            const isCompleted = await prompt.isCompleted(tokenId);
            // const memberCount = await prompt.memberCount(tokenId);
            // console.log('isCompleted', isCompleted);
            // console.log('memberCount', memberCount);
            expect(isCompleted).to.equal(true);
        });

        it("cannot mint if not a reservedAddress", async function () {
            const total = await calculatePayment(tokenId);
            const buyer = await prompt.connect(addr6);

            await expect(buyer.mint(tokenId, {value: total}))
                .to.be.reverted;
        });

        it("non-minted token does not have tokenURI", async function () {
            await expect(prompt.tokenURI(tokenId)).to.be.reverted;
        });

        it("can mint if the account is reservedAddress and session completed", async function () {
            const total = await calculatePayment(tokenId);
            const buyerReserved = await prompt.connect(addr5);
            // console.log("------")
            // console.log("buyer", addr5.address)
            // console.log("------")
            expect(await buyerReserved.mint(tokenId, {value: total}))
                .to.emit(prompt, "Transfer")
                .withArgs(ethers.constants.AddressZero, addr5.address, tokenId);
        });

        it("cannot set new price if minted", async function () {
            const member = await prompt.connect(addr1);
            await expect(member.setPrice(tokenId, contributionPrice_1_new))
                .to.be.reverted;
        });

        it("a member can contribute to the second session", async function () {
            const member = await prompt.connect(owner);
            await expect(member.contribute(tokenId_1, contributionURI_1, contributionPrice_1))
                .to.emit(prompt, "Contributed")
                .withArgs(tokenId_1, contributionURI_1, owner.address, contributionPrice_1);
        });

        it("another member can contribute to the second session", async function () {
            const member = await prompt.connect(addr2);
            await expect(member.contribute(tokenId_1, contributionURI_2, contributionPrice_2))
                .to.emit(prompt, "Contributed")
                .withArgs(tokenId_1, contributionURI_2, addr2.address, contributionPrice_2);
        });

        it("anyone can mint if session is completed and does not have reservedAddress", async function () {
            const total = await calculatePayment(tokenId_1);
            const buyer = await prompt.connect(addr7);

            expect(await buyer.mint(tokenId_1, {value: total}))
                .to.emit(prompt, "Transfer")
                .withArgs(ethers.constants.AddressZero, addr7.address, tokenId_1);
        });

        it("buyer is the owner for reserved session", async function () {
            let nftOwner = await prompt.ownerOf(tokenId);
            expect(nftOwner).to.equal(addr5.address);
        });

        it("buyer is the owner for non-reserved session", async function () {
            let nftOwner = await prompt.ownerOf(tokenId_1);
            expect(nftOwner).to.equal(addr7.address);
        });

        it("addr1 contributed token 1 and 0", async function () {
            // in reverse order because add1 first minted & contr token_1 then contr token_0
            const tokenId_1_big = ethers.BigNumber.from(tokenId_1);
            const tokenId_big = ethers.BigNumber.from(tokenId);
            const tokens = [tokenId_1_big, tokenId_big];
            expect(await prompt.getContributedTokens(addr1.address)).to.eql(tokens);
        });

        it("minted token has the correct tokenURI", async function () {
            const mintedTokenURI = await prompt.tokenURI(tokenId);
            expect(mintedTokenURI).to.eql(tokenURI_2);
        });

        it("get a session that is minted", async function () {
            const mySession = await prompt.getSession(tokenId);
            // console.log(mySession);

            expect(mySession[0]).to.eql(addr5.address); // addr5 the new owner
            expect(mySession[1]).to.eql(tokenURI_2); // tokenURI
            expect(mySession[2]).to.eql(members); // deep equality check for arrays
            // mySession[3] // contributions array
        });
    });

    describe("Withdraw", function () {

        it("first contributor's contract balance equals to her contributions", async function () {
            const contrContractBalance = await prompt.balance(members[0]);
            // contributed two times from this price
            const totalContribution = contributionPrice_0.mul(2);
            expect(contrContractBalance).to.eql(totalContribution);
        });

        it("first contributor's releasable amount equals to her contribution", async function () {
            const payment = await prompt.releasable(members[0]);
            const totalContribution = contributionPrice_0.mul(2);
            expect(payment).to.eql(totalContribution);
        });

        it("first contributor can withdraw releasable amount", async function () {
            const contributor = await prompt.connect(owner);
            const totalContribution = contributionPrice_0.mul(2);

            expect(await contributor.withdraw(members[0]))
                .to.emit(prompt, "PaymentReleased")
                .withArgs(members[0], totalContribution);
        });

        it("first contributor cannot withdraw if payment is not due", async function () {
            const contributor = await prompt.connect(owner);
            const totalContribution = contributionPrice_0.mul(2);

            await expect(contributor.withdraw(members[0]))
                .to.be.reverted;
        });

        it("second contributor's contract balance equals to her contributions", async function () {
            const contrContractBalance = await prompt.balance(members[1]);
            // contributed two times from this price
            const totalContribution = contributionPrice_1.add(contributionPrice_1_new);
            expect(contrContractBalance).to.eql(totalContribution);
        });

        it("second contributor's releasable amount equals to her contributions", async function () {
            const payment = await prompt.releasable(members[1]);
            const totalContribution = contributionPrice_1.add(contributionPrice_1_new);
            expect(payment).to.eql(totalContribution);
        });

        it("second contributor can withdraw releasable amount", async function () {
            const contributor = await prompt.connect(addr1);
            const totalContribution = contributionPrice_1.add(contributionPrice_1_new);

            expect(await contributor.withdraw(members[1]))
                .to.emit(prompt, "PaymentReleased")
                .withArgs(members[1], totalContribution);
        });

        it("third contributor's contract balance equals to her contributions", async function () {
            const contrContractBalance = await prompt.balance(members[2]);
            // contributed two times from this price
            const totalContribution = contributionPrice_2.mul(2);
            expect(contrContractBalance).to.eql(totalContribution);
        });

        it("third contributor's releasable amount equals to her contributions", async function () {
            const payment = await prompt.releasable(members[2]);
            const totalContribution = contributionPrice_2.mul(2);
            expect(payment).to.eql(totalContribution);
        });

        it("third contributor can withdraw releasable amount", async function () {
            const contributor = await prompt.connect(owner);
            const totalContribution = contributionPrice_2.mul(2);

            expect(await contributor.withdraw(members[2]))
                .to.emit(prompt, "PaymentReleased")
                .withArgs(members[2], totalContribution);
        });

        it("minter balance and mint fee address balance check", async function () {
            // minter
            const addr5Balance = await addr5.getBalance();
            console.log('addr5Balance', ethers.utils.formatEther(addr5Balance));

            // contributors
            // const ownerBalance = await owner.getBalance();
            // console.log(owner.address, ethers.utils.formatEther(ownerBalance));

            // const addr1Balance = await addr1.getBalance();
            // console.log(addr1.address, ethers.utils.formatEther(addr1Balance));

            // const addr2Balance = await addr2.getBalance();
            // console.log(addr2.address, ethers.utils.formatEther(addr2Balance));

            // feeAddress
            const addr6Balance = await addr6.getBalance();
            console.log(addr6.address, ethers.utils.formatEther(addr6Balance));
        });
    });
});
