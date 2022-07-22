import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ethers, waffle } from 'hardhat';
import chai from 'chai';
import { Contract } from 'ethers';

chai.use(waffle.solidity);
const { expect } = chai;

const NFT_NAME = 'RejectableNFT';
const NFT_SYMBOL = 'RNFT';
const BASE_URI = 'https://example.com/nft';

describe('RejectableNFT', () => {
  let rejectableNFT: Contract;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;

  beforeEach(async () => {
    [owner, user1] = await ethers.getSigners();
    const RejectableNFT = await ethers.getContractFactory('RejectableNFT');
    rejectableNFT = await RejectableNFT.deploy(NFT_NAME, NFT_SYMBOL);
    await rejectableNFT.deployed();
  });

  /**
   * Deployment
   */
  describe('Deployment', () => {
    it('RejectableNFT contract deployed successfully', async () => {
      expect(rejectableNFT.address).to.not.be.undefined;
    });

    it('Check name and symbol', async () => {
      expect(await rejectableNFT.name()).to.be.equal(NFT_NAME);
      expect(await rejectableNFT.symbol()).to.be.equal(NFT_SYMBOL);
    });
  });

  /**
   * Ownership
   */
  /* describe('Ownership', () => {
    it('Check owner', async () => {
      expect(await rejectableNFT.owner()).to.be.equal(owner.address);
    });

    it('Non owner can\'t transfer ownership', async () => {
      await expect(
        rejectableNFT.connect(user1).transferOwnership(owner.address)
      ).to.be.reverted;
    });

    it('Owner can transfer ownership', async () => {
      expect(await rejectableNFT.owner()).to.be.equal(owner.address);
      await rejectableNFT.connect(owner).transferOwnership(user1.address);
      expect(await rejectableNFT.owner()).to.be.equal(user1.address);
    });
  }); */
});
