import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import image from "../assets/logo192.svg";
import zkpVaultABI from "../abi/zkpVault.json";

const Navbar = () => {
  const [account, setAccount] = useState("");

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

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
      }
    } catch (error) {
      console.error("Error checking if wallet is connected:", error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Please install MetaMask to use this dApp!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);

      // Switch to the desired network (Polygon Mumbai testnet)
      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x98a' }], // Chain ID for Polygon Mumbai testnet
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
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

      // Now you can interact with your contract
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract("0x2923fffc9ba79400F74A3a644D966370441eD653", zkpVaultABI, signer);
      
      try {
        const hasSoul = await contract.hasSoul(accounts[0]);
        console.log("Has Soul:", hasSoul);
      } catch (error) {
        console.error("Error checking hasSoul:", error);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  return (
    <div className="flex justify-between w-full items-center bg-gradient-to-r from-blue-400 to-cyan-500">
      <a href="/"><p className="text-3xl text-blue-900 font-bold pl-10">zk Guard</p></a>
      <div className="flex gap-10 text-lg font-bold">
        <a href="/proofs"><p className="hover:underline cursor-pointer">Generate Proofs</p></a>
        <a href="/myproofs"><p className="hover:underline cursor-pointer">Proof History</p></a>
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

export default Navbar;