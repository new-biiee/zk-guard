import { ethers } from 'hardhat';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

/**
 * Deploys the SpiritLink and Verifier contracts.
 * @returns {Promise<void>} A promise that resolves when the deployment is complete.
 */
async function main() {

    // Deploy SpiritLink contract
    const SpiritLink = await ethers.getContractFactory('SpiritLink');
    const spiritlink = await SpiritLink.deploy();
    await spiritlink.deployed();

    // // Deploy Verifier contract
    // const Verifier = await ethers.getContractFactory('Verifier');
    // const verifier = await Verifier.deploy();
    // await verifier.deployed();

    // Log the contract addresses
    console.log(
      `The SpiritLink contract address is ${spiritlink.address}`
    );
    
    // console.log(
    //   `The Verifier contract address is ${verifier.address}`
    // );

    return;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// The SpiritLink for CreditScore contract address is 0x8A4AA4679EB53507023F74897aE3A8570fa224ca
// The SpiritLink for Follower contract address is 0xF0D56Ce5A1b550F07481dc98959EFD79eE9ab540
// The SpiritLink for Age contract address is 0xC2D208f5E94f4d7c0BFb3bb8352530f28bb31FE1
// The Verifier contract address is 0x50Ad8604CabeE301e45069603Ba0253A8010DF14
