import { ethers } from 'hardhat';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

/**
 * Deploys the CreditScoreVerifier.
 * @returns {Promise<void>} A promise that resolves when the deployment is complete.
 */
async function main() {

    // Deploy CreditScoreVerifier contract
    const CreditScoreVerifier = await ethers.getContractFactory('CreditScoreVerifier');
    const creditscoreverifier = await CreditScoreVerifier.deploy();
    await creditscoreverifier.deployed();

    // Log the contract addresses
    console.log(
      `The CreditScoreVerifier contract address is ${creditscoreverifier.address}`
    );

    return;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// The CreditScoreVerifier contract address is 0x50Ad8604CabeE301e45069603Ba0253A8010DF14