import { expect } from "chai";
import { network } from "hardhat";
import "@nomicfoundation/hardhat-ethers-chai-matchers";

const { ethers } = await network.getOrCreate();

describe("RWA Tokenization Flow", function () {
  let token: any;
  let treasury: any;
  let owner: any;
  let user: any;

  const maxSupply = ethers.parseEther("1000"); // 1000 tokens
  const rate = 100n; // 1 ETH = 100 tokens

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("EightySixToken");
    token = await Token.deploy(maxSupply);
    await token.waitForDeployment();

    const Treasury = await ethers.getContractFactory("Treasury");
    treasury = await Treasury.deploy(await token.getAddress(), rate);
    await treasury.waitForDeployment();

    await token.setTreasury(await treasury.getAddress());
  });


  it("Should set correct max supply", async function () {
    expect(await token.maxSupply()).to.equal(maxSupply);
  });

  it("Should set correct rate", async function () {
    expect(await treasury.rate()).to.equal(rate);
  });


  it("Should mint tokens on deposit", async function () {
    const depositAmount = ethers.parseEther("1");

    await treasury.connect(user).deposit(0n, { value: depositAmount });

    const expectedTokens = depositAmount * rate;
    const balance = await token.balanceOf(user.address);
    expect(balance).to.equal(expectedTokens);
  });

  it("Should emit Deposit event", async function () {
    const depositAmount = ethers.parseEther("1");

    await expect(treasury.connect(user).deposit(0n, { value: depositAmount }))
      .to.emit(treasury, "Deposit")
      .withArgs(user.address, depositAmount, depositAmount * rate);
  });

  it("Should fail for zero deposit", async function () {
    await expect(
      treasury.connect(user).deposit(0n, { value: 0 })
    ).to.be.revertedWith("Zero deposit");
  });

  it("Should revert if minTokensOut is not met", async function () {
    const depositAmount = ethers.parseEther("1");
    const expectedTokens = depositAmount * rate;
    const tooHighFloor = expectedTokens + 1n;

    await expect(
      treasury.connect(user).deposit(tooHighFloor, { value: depositAmount }),
    ).to.be.revertedWith("Slippage");
  });

  it("Should succeed when minTokensOut equals expected mint amount", async function () {
    const depositAmount = ethers.parseEther("1");
    const expectedTokens = depositAmount * rate;

    await treasury.connect(user).deposit(expectedTokens, { value: depositAmount });

    expect(await token.balanceOf(user.address)).to.equal(expectedTokens);
  });

  it("Should not exceed max supply", async function () {
    const hugeDeposit = maxSupply / rate + 1n;

    await expect(
      treasury.connect(user).deposit(0n, { value: hugeDeposit })
    ).to.be.revertedWith("Max supply exceeded");
  });

  it("Should not allow non-treasury to mint", async function () {
    await expect(
      token.connect(user).mint(user.address, 100)
      ).to.be.revertedWith("Not treasury");
    });

  it("Only owner can withdraw", async function () {
    const depositAmount = ethers.parseEther("1");
    await treasury.connect(user).deposit(0n, { value: depositAmount });

    await expect(
      treasury.connect(user).withdraw(depositAmount)
    ).to.be.revertedWithCustomError(
      treasury,
      "OwnableUnauthorizedAccount"
    );
});


  it("Owner should withdraw ETH", async function () {
    const depositAmount = ethers.parseEther("1");
    await treasury.connect(user).deposit(0n, { value: depositAmount });

    const balanceBefore = await ethers.provider.getBalance(owner.address);

    const tx = await treasury.withdraw(depositAmount);
    const receipt = await tx.wait();

    const gasUsed = receipt!.gasUsed * tx!.gasPrice!;
    const balanceAfter = await ethers.provider.getBalance(owner.address);

    expect(balanceAfter).to.be.closeTo(
      balanceBefore + depositAmount - BigInt(gasUsed),
      ethers.parseEther("0.01")
    );
  });

  it("Should emit Withdraw event", async function () {
    const depositAmount = ethers.parseEther("1");
    await treasury.connect(user).deposit(0n, { value: depositAmount });

    await expect(treasury.withdraw(depositAmount))
      .to.emit(treasury, "Withdraw")
      .withArgs(owner.address, depositAmount);
  });

  it("Owner can update rate", async function () {
    await treasury.setRate(200);
    expect(await treasury.rate()).to.equal(200);
  });

  it("Non-owner cannot update rate", async function () {
    await expect(
      treasury.connect(user).setRate(200)
    ).to.be.revertedWithCustomError(
      treasury,
      "OwnableUnauthorizedAccount"
    );
  });

  
});
