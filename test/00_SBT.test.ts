import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers, waffle } from 'hardhat';
import chai from 'chai';
import { Contract } from 'ethers';

chai.use(waffle.solidity);
const { expect } = chai;

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const NFT_NAME = 'NFT test';
const NFT_SYMBOL = 'NFT1';
const RNFT_NAME = 'Rejectable NFT test';
const RNFT_SYMBOL = 'RNFT1';

describe('RejectableNFT', () => {
  let nft: Contract;
  let rejectableNFT: Contract;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();

    // deploy NFT
    const NFT = await ethers.getContractFactory('NFT');
    nft = await NFT.deploy(NFT_NAME, NFT_SYMBOL);
    await nft.deployed();

    // deploy RejectableNFT
    const RejectableNFT = await ethers.getContractFactory('RejectableNFT');
    rejectableNFT = await RejectableNFT.deploy(RNFT_NAME, RNFT_SYMBOL);
    await rejectableNFT.deployed();
  });

  /**
   * Deployment
   */
  describe('Deployment', () => {
    it('Contracts deployed successfully', async () => {
      expect(nft.address).to.not.be.undefined;
      expect(rejectableNFT.address).to.not.be.undefined;
    });

    it('Check name and symbol', async () => {
      expect(await nft.name()).to.be.equal(NFT_NAME);
      expect(await nft.symbol()).to.be.equal(NFT_SYMBOL);
      expect(await rejectableNFT.name()).to.be.equal(RNFT_NAME);
      expect(await rejectableNFT.symbol()).to.be.equal(RNFT_SYMBOL);
    });
  });

  /**
   * Ownership
   */
  describe('Ownership', () => {
    it('Check owner', async () => {
      expect(await nft.owner()).to.be.equal(owner.address);
      expect(await rejectableNFT.owner()).to.be.equal(owner.address);
    });

    it('Non owner can\'t transfer ownership', async () => {
      await expect(
        nft.connect(user1).transferOwnership(owner.address)
      ).to.be.reverted;
      await expect(
        rejectableNFT.connect(user1).transferOwnership(owner.address)
      ).to.be.reverted;
    });

    it('Owner can transfer ownership', async () => {
      expect(await nft.owner()).to.be.equal(owner.address);
      await nft.connect(owner).transferOwnership(user1.address);
      expect(await nft.owner()).to.be.equal(user1.address);

      expect(await rejectableNFT.owner()).to.be.equal(owner.address);
      await rejectableNFT.connect(owner).transferOwnership(user1.address);
      expect(await rejectableNFT.owner()).to.be.equal(user1.address);
    });
  });

  /**
   * Mint a NFT
   */
  describe('Mint a NFT', () => {
    it('Non owner can\'t mint', async () => {
      await expect(nft.connect(user1).safeMint(user1.address)).to
        .be.reverted;
    });

    it('Owner can mint', async () => {
      // before minting, we have a balance of 0
      expect(await nft.balanceOf(user1.address)).to.be.equal(0);
      // mint
      await nft.connect(owner).safeMint(user1.address);
      // after minting, we have a balance of 1
      expect(await nft.balanceOf(user1.address)).to.be.equal(1);
      expect(await nft.ownerOf(0)).to.be.equal(user1.address);
    });
  });

  /**
   * Transfer a NFT
   */
  describe('Transfer a NFT', () => {
    beforeEach(async () => {
      await nft.connect(owner).safeMint(user1.address);
    });

    it('You can\'t transfer if you aren\'t the owner nor approved', async () => {
      await expect(
        nft.connect(owner).transferFrom(user1.address, user2.address, 1)
      ).to.be.reverted;
    });

    it('Transfer a token', async () => {
      // before transfer, we have a balance of 0
      expect(await nft.balanceOf(user2.address)).to.be.equal(0);
      // transfer
      await nft.connect(user1).transferFrom(user1.address, user2.address, 0);
      // after transfer, we have a balance of 1
      expect(await nft.balanceOf(user2.address)).to.be.equal(1);
      expect(await nft.ownerOf(0)).to.be.equal(user2.address);
    });
  });

  /**
   * Mint a Rejectable NFT
   */
  describe('Mint a Rejectable NFT', () => {
    it('Non owner can\'t mint', async () => {
      await expect(rejectableNFT.connect(user1).safeMint(user1.address)).to
        .be.reverted;
    });

    it('Owner can mint', async () => {
      // before minting, we have a balance of 0
      expect(await rejectableNFT.balanceOf(user1.address)).to.be.equal(0);
      // mint
      await rejectableNFT.connect(owner).safeMint(user1.address);
      // after minting, we have a balance of 0, because the receiver needs to accept
      expect(await rejectableNFT.balanceOf(user1.address)).to.be.equal(0);
      expect(await rejectableNFT.ownerOf(0)).to.be.equal(ZERO_ADDRESS);
    });
  });

  /**
   * Transfer a Rejectable NFT
   */
  describe('Transfer a Rejectable NFT', () => {
    beforeEach(async () => {
      await rejectableNFT.connect(owner).safeMint(user1.address);
      await rejectableNFT.connect(user1).acceptTransfer(0);
    });

    it('You can\'t transfer if you aren\'t the owner nor approved', async () => {
      await expect(
        rejectableNFT.connect(owner).transferFrom(user1.address, user2.address, 1)
      ).to.be.reverted;
    });

    it('Transfer a token', async () => {
      // before transfer, we have a balance of 0
      expect(await rejectableNFT.balanceOf(user2.address)).to.be.equal(0);
      // transfer
      await rejectableNFT.connect(user1).transferFrom(user1.address, user2.address, 0);
      // after transfer, we have a balance of 0, because the receiver needs to accept
      expect(await rejectableNFT.balanceOf(user2.address)).to.be.equal(0);
      // user1 is still the owner of the token
      expect(await rejectableNFT.ownerOf(0)).to.be.equal(user1.address);
    });

    // TODO: We also need to test the EVENTS
  });
});
