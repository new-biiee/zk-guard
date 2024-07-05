import { ethers } from 'hardhat';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

/**
 * Deploys the AgeVerifier.
 * @returns {Promise<void>} A promise that resolves when the deployment is complete.
 */
async function main() {

    // Deploy AgeVerifier contract
    const AgeVerifier = await ethers.getContractFactory('AgeVerifier');
    const ageverifier = await AgeVerifier.deploy();
    await ageverifier.deployed();

    // Log the contract addresses
    console.log(
      `The AgeVerifier contract address is ${ageverifier.address}`
    );
    return;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// The AgeVerifier contract address is 0xd34Dfde3EaBFAa64fD60944b045003F2B9632D70