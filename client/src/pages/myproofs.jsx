import Navbar from "../components/navbar";
import zkpVaultABI from "../abi/zkpVault.json";
import React from "react";
import { toast, Toaster } from "react-hot-toast";
import { ethers } from "ethers";
import {verifierContractAddressAge, zkpVaultContractConfigAge, verifierContractAddressCredit, zkpVaultContractConfigCredit, verifierContractAddressTwitter, zkpVaultContractConfigTwitter } from "../config"

const MyProofs = () => {
  const [mounted, setMounted] = React.useState(false);
  const [hasSpiritCredit, setHasSpiritCredit] = React.useState(false);
  const [hasSpiritTwitter, setHasSpiritTwitter] = React.useState(false);
  const [hasSpiritAge, setHasSpiritAge] = React.useState(false);
  const [isBurnAgeLoading, setIsBurnAgeLoading] = React.useState(false);
  const [isBurnCreditLoading, setIsBurnCreditLoading] = React.useState(false);
  const [isBurnTwitterLoading, setIsBurnTwitterLoading] = React.useState(false);
  const [sltDataAge, setSltDataAge] = React.useState(null);
  const [sltDataCredit, setSltDataCredit] = React.useState(null);
  const [sltDataTwitter, setSltDataTwitter] = React.useState(null);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const address = signer.getAddress();
  const ageContract = new ethers.Contract(zkpVaultContractConfigAge.address, zkpVaultContractConfigAge.abi, signer);
  const creditContract = new ethers.Contract(zkpVaultContractConfigCredit.address, zkpVaultContractConfigCredit.abi, signer);
  const twitterContract = new ethers.Contract(zkpVaultContractConfigTwitter.address, zkpVaultContractConfigTwitter.abi, signer);

  React.useEffect(() => {
    setMounted(true);
    fetchSpiritStatus();
  }, []);

  const fetchSpiritStatus = async () => {
    try {
      const [ageSpirit, creditSpirit, twitterSpirit] = await Promise.all([
        ageContract.hasSpirit(address),
        creditContract.hasSpirit(address),
        twitterContract.hasSpirit(address)
      ]);
      setHasSpiritAge(ageSpirit);
      setHasSpiritCredit(creditSpirit);
      setHasSpiritTwitter(twitterSpirit);

      if (ageSpirit) fetchSltData(ageContract, setSltDataAge);
      if (creditSpirit) fetchSltData(creditContract, setSltDataCredit);
      if (twitterSpirit) fetchSltData(twitterContract, setSltDataTwitter);
    } catch (error) {
      console.error("Error fetching spirit status: ", error);
    }
  };

  const fetchSltData = async (contract, setStateFunction) => {
    try {
      const data = await contract.getSLTData(address);
      setStateFunction(data);
    } catch (error) {
      console.error("Error fetching SLT data: ", error);
    }
  };

  const burnProof = async (contract, setLoadingState, proofType) => {
    setLoadingState(true);
    try {
      const tx = await contract.burn(address);
      await tx.wait();
      toast.success(`${proofType} proof burned successfully`);
      fetchSpiritStatus(); // Refresh the status after burning
    } catch (error) {
      console.error(`Error burning ${proofType} proof: `, error);
      toast.error(`Failed to burn ${proofType} proof`);
    }
    setLoadingState(false);
  };

  const handleBurnAgeButton = () => burnProof(ageContract, setIsBurnAgeLoading, "Age");
  const handleBurnCreditButton = () => burnProof(creditContract, setIsBurnCreditLoading, "Credit");
  const handleBurnTwitterButton = () => burnProof(twitterContract, setIsBurnTwitterLoading, "Twitter");

  return (
    <div className="h-[100vh] w-full bg-gradient-to-r from-blue-400 to-cyan-400">
      <Toaster />
      <Navbar />
      <p className="flex justify-center mt-8   text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400  to-cyan-400">
        Your Proofs
      </p>
      <div className="flex flex-col gap-3 p-4 m-4 bg-gradient-to-r from-blue-400 to-cyan-400  rounded-xl border border-black" style={{borderWidth: "5px"}}>
        <div className="grid grid-cols-3 justify-items-center font-bold text-xl p-3 w-full ">
          <p>Proof</p>
          <p>Verification Key</p>
          <p> </p>
        </div>
        {!hasSpiritCredit && !hasSpiritTwitter &&  !hasSpiritAge &&(
          <div className="w-full p-3 bg-violet-300 border border-violet-400 justify-items-cente rounded-xl">
            <p className="text-center italic text-xl">
              No Proofs found. You can Generate Proof{" "}
              <a href="/proofs">
                {" "}
                <span className="cursor-pointer font-semibold underline">
                  here
                </span>
              </a>
            </p>
          </div>
        )}
        {hasSpiritCredit && (
          <div className="p-3 bg-violet-300 border border-violet-400 justify-items-center  grid grid-cols-3 rounded-xl ">
            <p className="w-fit text-xl font-bold">Proof of Credit 💸</p>
            <p
              className="cursor-pointer font-mono hover:underline font-bold"
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(sltDataCredit));
                toast("Copied to Clipboard", {
                  icon: "📋",
                });
              }}
            >
              Copy Verification Key
            </p>
            <button
              onClick={handleBurnCreditButton}
              className="px-4 py-2 border border-red-500  w-fit  bg-red-400 text-white rounded-xl"
            >
              {isBurnCreditLoading ? "Burning..." : "Burn SLT"}
            </button>
          </div>
        )}

        {hasSpiritTwitter && (
          <div className="p-3 bg-violet-300 border border-violet-400 grid grid-cols-3 justify-items-center rounded-xl ">
            <p className="text-xl font-bold">Proof of Followers 👥</p>
            <p
              className="cursor-pointer font-mono hover:underline font-bold"
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(sltDataTwitter));
                toast("Copied to Clipboard", {
                  icon: "📋",
                });
              }}
            >
              Copy Verification Key
            </p>
            <button
              onClick={handleBurnTwitterButton}
              className="px-4 py-2 border border-red-500  w-fit  bg-red-400 text-white rounded-xl"
            >
              {isBurnTwitterLoading ? "Burning..." : "Burn SLT"}
            </button>
          </div>
        )}

        {hasSpiritAge && (
          <div className="p-3 bg-violet-300 border border-violet-400 grid grid-cols-3 justify-items-center rounded-xl ">
            <p className="text-xl font-bold">Proof of Age 🔞</p>
            <p
              className="cursor-pointer font-mono hover:underline font-bold"
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(sltDataAge));
                toast("Copied to Clipboard", {
                  icon: "📋",
                });
              }}
            >
              Copy Verification Key
            </p>
            <button
              onClick={handleBurnAgeButton}
              className="px-4 py-2 border border-red-500  w-fit  bg-red-400 text-white rounded-xl"
            >
              {isBurnAgeLoading ? "Burning..." : "Burn SLT"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default MyProofs;
