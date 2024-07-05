import { ethers } from 'hardhat';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

/**
 * Deploys the FollowerVerifier.
 * @returns {Promise<void>} A promise that resolves when the deployment is complete.
 */
async function main() {

    // Deploy FollowerVerifier contract
    const FollowerVerifier = await ethers.getContractFactory('FollowerVerifier');
    const followerverifier = await FollowerVerifier.deploy();
    await followerverifier.deployed();

    // Log the contract addresses
    console.log(
      `The FollowerVerifier contract address is ${followerverifier.address}`
    );

    return;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// The FollowerVerifier contract address is 0xb722Fb125f85D727a2e766C4e3A86E205746D0A3