import { ethers } from "ethers";

const bigNumToNum = (bigNumberString) => {
    const bigNumber = ethers.BigNumber.from(bigNumberString);
    const integer = bigNumber.toNumber();
    return integer;
}

const totalSupplyData = async (contract) => {
  try {
    const totalSLT = await contract.totalSLT();
    const totalslt = bigNumToNum(totalSLT);
    return totalslt;
  } catch (error) {
    console.error("Error in getBorrow_interestRate(): ", error);
  }
}

  const hasSpirit = async (contract, user) => {
    try {
      const hasSpirit = await contract.hasSpirit(user);
      return hasSpirit;
    } catch (error) {
      console.error("Error in getBorrow_interestRate(): ", error);
    }
}

const getSLTData = async (contract, user) => {
    try {
      const getSLTData = await contract.getSLTData(user);
      return getSLTData;
    } catch (error) {
      console.error("Error in getBorrow_interestRate(): ", error);
    }
}

const validateAttribute = async (contract, user, verifierAddress) => {
    try {
      const validateAttribute = await contract.validateAttribute(user, verifierAddress);
      return validateAttribute;
    } catch (error) {
      console.error("Error in getBorrow_interestRate(): ", error);
    }
}

