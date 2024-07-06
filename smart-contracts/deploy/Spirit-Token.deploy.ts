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

// The SpiritLink for CreditScore contract address is 0xF0D56Ce5A1b550F07481dc98959EFD79eE9ab540
// The SpiritLink for Follower contract address is 0xC2D208f5E94f4d7c0BFb3bb8352530f28bb31FE1
// The SpiritLink for Age contract address is 0xd34Dfde3EaBFAa64fD60944b045003F2B9632D70
// The Verifier contract address is 0xb722Fb125f85D727a2e766C4e3A86E205746D0A3

