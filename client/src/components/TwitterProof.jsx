import { Toaster, toast } from "react-hot-toast";
import { ethers } from "ethers";
import React from "react";
import axios from "axios";
import {zkpVaultContractConfigTwitter, verifierContractAddressTwitter} from "../config"

const TwitterFollowers = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(zkpVaultContractConfigTwitter.address, zkpVaultContractConfigTwitter.abi, signer);

  const [proofStatus, setProofStatus] = React.useState(false);
  const [isMinting, setIsMinting] = React.useState(false);
  const [getFollowers, setFollowers] = React.useState("");
  const [getThreshold, setThreshold] = React.useState("");
  const [getCallData, setCallData] = React.useState({});
  const [totalMinted, setTotalMinted] = React.useState(0);
  const [getHasSpirit, setHasSpirit] = React.useState(false);
  const [getVerificationAddress, setVerificationAddress] = React.useState("");
  const [getVerificationStatus, setVerificationStatus] = React.useState(null);

  const bigNumToNum = (bigNumberString) => {
    const bigNumber = ethers.BigNumber.from(bigNumberString);
    const integer = bigNumber.toNumber();
    return integer;
  }

  const totalSupplyData = async () => {
    try {
      const totalSupply = await contract.totalSLT();
      setTotalMinted(bigNumToNum(totalSupply));
    } catch (error) {
      console.error("Error fetching total supply: ", error);
    }
  };

  const hasSpirit = async () => {
    try {
      const address = await signer.getAddress();
      const spiritStatus = await contract.hasSpirit(address);
      setHasSpirit(spiritStatus);
    } catch (error) {
      console.error("Error fetching spirit status: ", error);
    }
  };

  const mint = async () => {
    try {
      setIsMinting(true);
      const tx = await contract.mint(getCallData.a, getCallData.b, getCallData.c, getCallData.Input);
      await tx.wait();
      toast.success("SLT minted successfully!");
      setHasSpirit(true);
    } catch (error) {
      console.error("Error in minting: ", error);
      toast.error("Error minting SLT. Please try again.");
    } finally {
      setIsMinting(false);
    }
  };

  async function handleMintButtonClick() {
    if (isNaN(parseInt(getFollowers)) || isNaN(parseInt(getThreshold))) {
      toast.error("Please enter valid numbers for Followers and Threshold");
      return;
    }
    if (getHasSpirit) {
      toast.error("Address already minted a SLT");
      return;
    }

    try {
      const callData = await getCallDataFromServer();
      if (Object.keys(callData).length === 0) {
        toast.error("Failed to generate proof. Please try again.");
        return;
      }
      setCallData(callData);
      toast.success("Proof generated successfully!");
      setProofStatus(true);
      const address = await signer.getAddress();
      setVerificationAddress(address);
    } catch (error) {
      console.error("Error generating proof:", error);
      toast.error("Error generating proof. Please try again.");
    }
  }

  function handleFollowersChange(e) {
    setFollowers(e.target.value);
  }
  function handleThresholdChange(e) {
    setThreshold(e.target.value);
  }

  const getCallDataFromServer = React.useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/twitter/generate-call-data?followers=${getFollowers}&threshold=${getThreshold}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return {};
    }
  }, [getFollowers, getThreshold]);

  React.useEffect(() => {
    hasSpirit();
    totalSupplyData();
  }, []);

  return (
    <>
      <div className="h-[650px] w-[25vw] rounded-md border border-blue-100 bg-blue-50 p-2 shadow-lg hover:shadow-xl ">
        <div>
          <Toaster />
        </div>

        <div className="flex justify-center">
          <img
            className="h-[250px] w-full object-cover rounded-md"
            src="./twitter-verified.webp"
            alt="Twitter Verified"
          />
        </div>
        <h1 className="text-xl font-extrabold text-center pt-3 text-blue-800 ">
          Proof Of Followers
        </h1>
        <div className="p-3">
        {!getHasSpirit && (
          <form className="h-[100px] items-center justify-center flex flex-col gap-4 contrast-more:border-slate-400 contrast-more:placeholder-slate-500">
            <input
              id="followers"
              type="number"
              className="outline-none rounded-xl p-3 w-full"
              placeholder="Enter number of Followers"
              required
              value={getFollowers}
              onChange={handleFollowersChange}
            />
            <div className="flex gap-3 items-center">
              <p className="font-bold">I have more than</p>
              <input
                id="threshold"
                type="number"
                className="outline-none w-[88px] rounded-lg placeholder:italic p-1"
                placeholder="e.g : 100"
                required
                value={getThreshold}
                onChange={handleThresholdChange}
              />
              <p className="font-bold"> follower(s)</p>
            </div>
          </form>
        )}

          <div className="flex mt-2 justify-center flex-col items-center">
            {mounted && !getHasSpirit && (
              <button
                className="p-2 border bg-violet-200 border-blue-300 w-[200px] transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 duration-300 hover:shadow-lg rounded-md m-4"
                onClick={proofStatus ? mint : handleMintButtonClick}
                disabled={isMinting}
              >
                {isMinting ? "Minting..." : (proofStatus ? "Mint" : "Generate Proof 🎉")}
              </button>
            )}
          </div>
          <div className="flex mt-6 flex-col gap-2">
            <p className="font-bold text-xl">Status ℹ️ :</p>

            <div
              className={`flex rounded-xl font-semibold text-sm justify-between border ${
                getHasSpirit
                  ? `border-green-200 bg-green-100`
                  : `border-red-200 bg-red-100`
              }  p-4 items-center `}
            >
              <p>SLT </p>
              <p
                className={`${
                  getHasSpirit ? `bg-green-400` : `bg-red-400 text-white`
                }  rounded-full px-3 py-1`}
              >
                {getHasSpirit ? "Minted" : "Not Minted"}
              </p>
            </div>
            {getHasSpirit && (
              <div
                className={`flex rounded-xl justify-between font-semibold text-sm border ${
                  getVerificationStatus
                    ? `border-green-200 bg-green-100`
                    : `border-red-200 bg-red-100`
                }  p-4 items-center `}
              >
                <p>Proof </p>
                <p
                  className={`${
                    getVerificationStatus ? `bg-green-400` : `bg-red-400 text-white`
                  }  rounded-full px-3 py-1`}
                >
                  {getVerificationStatus ? "Verified" : "Not Verified"}
                </p>
              </div>
            )}
          </div>

          <p className="select-none italic opacity-80 mt-3  text-center text-xs font-semibold">
            {totalMinted} Proof of Followers ZK SLT minted so far!
          </p>
        </div>
      </div>
    </>
  );
};

export default TwitterFollowers;
