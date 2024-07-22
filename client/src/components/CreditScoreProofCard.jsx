import { Toaster, toast } from "react-hot-toast";
import { ethers } from "ethers";
import React from "react";
import axios from "axios";
import { zkGuardContractConfigCredit, verifierContractAddressCredit } from "../config";

const CreditScore = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(zkGuardContractConfigCredit.address, zkGuardContractConfigCredit.abi, signer);

  const [proofStatus, setProofStatus] = React.useState(false);
  const [isMinted, setIsMinted] = React.useState(false);
  const [getCreditScore, setCreditScore] = React.useState("");
  const [getCallData, setCallData] = React.useState({});
  const [totalMinted, setTotalMinted] = React.useState(0);
  const [getHasSpirit, setHasSpirit] = React.useState(false);
  const [getVerificationAddress, setVerificationAddress] = React.useState("");
  const [getVerificationStatus, setVerificationStatus] = React.useState(false);

  const bigNumToNum = (bigNumberString) => {
    const bigNumber = ethers.BigNumber.from(bigNumberString);
    return bigNumber.toNumber();
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

  const addressVerified = async () => {
    try {
      const verified = await contract.validateAttribute(getVerificationAddress, verifierContractAddressCredit);
      setVerificationStatus(verified);
    } catch (error) {
      console.error("Error validating address: ", error);
    }
  };

  const mint = async () => {
    try {
      const tx = await contract.mint(getCallData.a, getCallData.b, getCallData.c, getCallData.Input);
      await tx.wait();
      setIsMinted(true);
      toast.success("SLT minted successfully!");
      hasSpirit();
    } catch (error) {
      console.error("Error in minting: ", error);
      toast.error("Error minting SLT. Please try again.");
    }
  };

  async function handleMintButtonClick() {
    if (getHasSpirit) {
      toast.error("Address already minted a SLT");
      return;
    }

    if (isNaN(parseInt(getCreditScore)) || parseInt(getCreditScore) < 0 || parseInt(getCreditScore) > 100) {
      toast.error("Please enter a valid credit score between 0 and 100");
      return;
    }

    try {
      const callData = await getCallDataFromServer();
      setCallData(callData);

      if (Object.keys(callData).length !== 0) {
        setProofStatus(true);
        toast.success("Proof generated successfully!");
      } else {
        toast.error("Error generating proof. Please try again.");
      }
    } catch (error) {
      console.error("Error generating proof: ", error);
      toast.error("Error generating proof. Please try again.");
    }
  }

  function handleCreditScoreChange(e) {
    setCreditScore(e.target.value);
  }

  const getCallDataFromServer = React.useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/credit/generate-call-data?creditScore=${getCreditScore}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching call data:", error);
      return {};
    }
  }, [getCreditScore]);

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
        <img className="h-[250px] w-full object-cover rounded-md" src="./credit.webp" alt="Credit Score" />
        <h1 className="text-xl font-extrabold text-center pt-3 text-blue-800 ">
          Proof Of Credit Score
        </h1>
        <div className="p-3">
        {!getHasSpirit && (
          <form className="h-[100px] items-center justify-center flex flex-col gap-4 contrast-more:border-slate-400 contrast-more:placeholder-slate-500">
            <input
              id="credit_score"
              type="number"
              className="outline-none rounded-xl p-3 w-full"
              placeholder="Input a credit score from 0 to 100"
              required
              value={getCreditScore}
              onChange={handleCreditScoreChange}
            />
          </form>
        )}
          <div>
            <div className="flex justify-center mt-2 flex-col items-center">
              {mounted && !isMinted && !getHasSpirit && (
                <button
                  className="p-2 border bg-violet-200 border-blue-300 w-[200px] transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 duration-300 hover:shadow-lg rounded-md m-4"
                  onClick={proofStatus ? mint : handleMintButtonClick}
                >
                  {!proofStatus ? "Generate Proof 🎉" : "Mint SLT"}
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
                      : `border-green-200 bg-green-100`
                  }  p-4 items-center `}
                >
                  <p>Proof </p>
                  <p
                    className={`${
                      getVerificationStatus
                        ? `bg-green-400`
                        : `bg-green-400`
                    }  rounded-full px-3 py-1`}
                  >
                    {getVerificationStatus ? "Verified" : "Verified"}
                  </p>
                </div>
              )}
            </div>
          </div>
          <p className="select-none italic opacity-80 mt-3 text-center text-xs font-semibold">
            {totalMinted} Proof of Credit Score ZK SLT minted so far!
          </p>
        </div>
      </div>
    </>
  );
};

export default CreditScore;
