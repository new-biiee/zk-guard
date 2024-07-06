import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  verifierContractAddressAge,
  verifierContractAddressCredit,
  verifierContractAddressTwitter,
  zkpVaultContractConfigAge,
  zkpVaultContractConfigCredit,
  zkpVaultContractConfigTwitter,
} from "./public";

const Verify = () => {
  const [verifiedAge, setVerifiedAge] = useState(false);
  const [verifiedCredit, setVerifiedCredit] = useState(false);
  const [verifiedTwitter, setVerifiedTwitter] = useState(false);
  const [hasSpiritTwitter, setHasSpiritTwitter] = useState(false);
  const [hasSpiritCredit, setHasSpiritCredit] = useState(false);
  const [hasSpiritAge, setHasSpiritAge] = useState(false);
  const [account, setAccount] = useState(null);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have MetaMask installed!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        setAccount(accounts[0]);
        return accounts[0];
      }
    } catch (error) {
      console.error("Error checking if wallet is connected:", error);
    }
    return null;
  };

  useEffect(() => {
    const initializeWallet = async () => {
      const connectedAccount = await checkIfWalletIsConnected();
      if (connectedAccount) {
        await checkSpiritAndValidate(connectedAccount);
      }
    };

    initializeWallet();
  }, []);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Please install MetaMask to use this dApp!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      const connectedAccount = accounts[0];
      setAccount(connectedAccount);

      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x98a' }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x98a',
                chainName: 'Polygon zkEVM Cardona Testnet',
                nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://rpc.cardona.zkevm-rpc.com'],
                blockExplorerUrls: ['https://cardona-zkevm.polygonscan.com/'],
              }],
            });
          } catch (addError) {
            console.error('Error adding Polygon Mumbai network:', addError);
          }
        } else {
          console.error('Error switching to Polygon Mumbai network:', switchError);
        }
      }

      await checkSpiritAndValidate(connectedAccount);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const checkSpiritAndValidate = async (accountAddress) => {
    if (!accountAddress) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contractAge = new ethers.Contract(zkpVaultContractConfigAge.address, zkpVaultContractConfigAge.abi, signer);
    const contractCredit = new ethers.Contract(zkpVaultContractConfigCredit.address, zkpVaultContractConfigCredit.abi, signer);
    const contractTwitter = new ethers.Contract(zkpVaultContractConfigTwitter.address, zkpVaultContractConfigTwitter.abi, signer);

    try {
      const [spiritAge, spiritCredit, spiritTwitter] = await Promise.all([
        contractAge.hasSpirit(accountAddress),
        contractCredit.hasSpirit(accountAddress),
        contractTwitter.hasSpirit(accountAddress)
      ]);

      setHasSpiritAge(spiritAge);
      setHasSpiritCredit(spiritCredit);
      setHasSpiritTwitter(spiritTwitter);

      if (spiritAge) {
        const verifiedAgeResult = await contractAge.validateAttribute(accountAddress, verifierContractAddressAge);
        setVerifiedAge(verifiedAgeResult);
      }

      if (spiritCredit) {
        const verifiedCreditResult = await contractCredit.validateAttribute(accountAddress, verifierContractAddressCredit);
        setVerifiedCredit(verifiedCreditResult);
      }

      if (spiritTwitter) {
        const verifiedTwitterResult = await contractTwitter.validateAttribute(accountAddress, verifierContractAddressTwitter);
        setVerifiedTwitter(verifiedTwitterResult);
      }
    } catch (error) {
      console.error("Error checking spirit or validating attributes:", error);
    }
  };

  return (
    <div className="flex flex-col mx-[20vw] my-[150px] justify-center items-center p-2 rounded-lg border h-[500px]">
      <p className="text-xl font-extrabold text-cyan-700 ">
        Unlock the xyz DAO's perks/airdrop 🪂{" "}
      </p>
      <p className="m-5 text-2xl font-bold underline">Requirements 📝</p>
      <div className="flex w-full gap-3 p-3 justify-center items-center rounded-md bg-cyan-50 flex-col ">
        <div className="justify-between items-center flex w-full ">
          <p className="font-bold">- YOU ARE 18 OR ABOVE? </p>
          {verifiedAge && (
            <div className="px-4 py-2 font-extrabold rounded-full bg-green-400 text-white">
              Verified
            </div>
          )}
          {!verifiedAge && (
            <div className="px-4 py-2 font-extrabold rounded-full bg-red-400 text-white">
              Not Verified
            </div>
          )}
        </div>
        <div className="justify-between items-center flex w-full ">
          <p className="font-bold">- YOU HAVE MORE THAN 100 FOLLOWERS? </p>
          {verifiedTwitter && (
            <div className="px-4 py-2 font-extrabold rounded-full bg-green-400 text-white">
              Verified
            </div>
          )}
          {!verifiedTwitter && (
            <div className="px-4 py-2 font-extrabold rounded-full bg-red-400 text-white">
              Not Verified
            </div>
          )}
        </div>

        <div className="justify-between items-center flex w-full ">
          <p className="font-bold">- YOU HAVE A CREDIT SCORE MORE THAN 25? </p>
          {verifiedCredit && (
            <div className="px-4 py-2 font-extrabold rounded-full bg-green-400 text-white">
              Verified
            </div>
          )}
          {!verifiedCredit && (
            <div className="px-4 py-2 font-extrabold rounded-full bg-red-400 text-white">
              Not Verified
            </div>
          )}
        </div>

        {(!verifiedAge || !verifiedCredit || !verifiedTwitter) && (
          <p className="font-extrabold">
            Sorry fam, You're not eligible...
          </p>
        )}
        {verifiedAge && verifiedCredit && verifiedTwitter && (
          <p className=" font-extrabold">
            {" "}
            LFGGGG.... You are eligible for the AIRDROP 🎉🎉🎉
          </p>
        )}
      </div>
      {account ? (
        <p style={{ paddingLeft: "36px", letterSpacing: "1px" }} className="w-[190px] py-2 bg-[#191919] text-white rounded-md font-semibold">
          {`${account.slice(0, 6)}...${account.slice(-5)}`}
        </p>
      ) : (
        <button onClick={connectWallet} className="w-[170px] py-2 bg-[#191919] text-white rounded-md font-semibold">
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default Verify;
