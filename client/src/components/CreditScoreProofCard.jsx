import { Toaster, toast } from "react-hot-toast";
import { ethers } from "ethers";
import React from "react";
import axios from "axios";
import zkpVaultABI from "../abi/zkpVault.json";

const verifierContractAddress = "0x2eDD5193F3bBdd2684Eff5C791BFADf40cD0912b";

const zkpVaultContractConfig = {
  address: "0x0E75923149e6857Dc596f1ade0E1919200973629",
  abi: zkpVaultABI,
  chainId: 80001,
};

const CreditScore = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const dateInputRef = React.useRef(null);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(zkpVaultContractConfig.address, zkpVaultContractConfig.abi, signer);

  const [proofStatus, setProofStatus] = React.useState(false);
  const [isMinted, setisMinted] = React.useState(null);
  const [getCreditScore, setCreditScore] = React.useState("");
  const [getCallData, setCallData] = React.useState({});
  const [totalMinted, setTotalMinted] = React.useState(0);
  const [getHasSoul, setHasSoul] = React.useState(false);
  const [getVerificationAddress, setVerificationAddress] = React.useState("");
  const [getVerificationStatus, setVerificationStatus] = React.useState(null);

  const bigNumToNum = (bigNumberString) => {
    const bigNumber = ethers.BigNumber.from(bigNumberString);
    const integer = bigNumber.toNumber();
    return integer;
}

  const totalSupplyData = async () => {
    try {
      const totalSupply = await contract.totalSBT();
      console.log(totalSupply);
      setTotalMinted(bigNumToNum(totalSupply));
    } catch (error) {
      console.error("Error fetching total supply: ", error);
    }
  };

  const hasSoul = async () => {
    try {
      const soulStatus = await contract.hasSoul(signer.getAddress());
      setHasSoul(soulStatus);
    } catch (error) {
      console.error("Error fetching soul status: ", error);
    }
  };

  const sbtData = async () => {
    try {
      const data = await contract.getSBTData(signer.getAddress());
      console.log(data);
    } catch (error) {
      console.error("Error fetching SBT data: ", error);
    }
  };

  const addressVerified = async () => {
    try {
      const verified = await contract.validateAttribute(getVerificationAddress, verifierContractAddress);
      console.log(verified);
    } catch (error) {
      console.error("Error validating address: ", error);
    }
  };

  const mint = async () => {
    try {
      const minted = await contract.mint(getCallData.a, getCallData.b, getCallData.c, getCallData.Input);
      return minted;
    } catch (error) {
      console.error("Error in minting: ", error);
    }
    const isMinted = await mint();
    setisMinted(isMinted);
  };

  async function handleMintButtonClick() {
    if (isNaN(parseInt(getCreditScore))) {
      toast.error("Please enter a valid credit score");
      return;
    }
    if (hasSoul) {
      toast.error("Address already minted a SBT");
      return;
    }
    if (parseInt(getCreditScore) > 100) {
      toast.error("Credit Score cannot be greater than 100");
      return;
    }
    const callData = await getCallDataFromServer();
    setCallData(callData);

    console.log("getcallback cccc", callData);
    if (Object.keys(getCallData).length !== 0) {
      mint?.();
    } else {
      toast("Genrated Proof", {
        icon: "🎉",
      });
      setProofStatus(true);
      setVerificationAddress(signer.getAddress());
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
      console.log(error);
      return {};
    }
  }, [getCreditScore]);

  React.useEffect(() => {
    hasSoul();
  }, []);

  React.useEffect(() => {
    totalSupplyData();
  }, []);

  return (
    <>
      {" "}
      <div className="h-[650px] w-[25vw] rounded-md border border-blue-100 bg-blue-50 p-2 shadow-lg hover:shadow-xl ">
        <div>
          <Toaster />
        </div>
        <img   className="h-[250px] w-full object-cover rounded-md" src="./credit.webp"></img>
        <h1 className="text-xl font-extrabold text-center pt-3 text-blue-800 ">
          Proof Of Credit Score
        </h1>
        <div className="p-3">
        {!getHasSoul &&  <form className="h-[100px] items-center justify-center flex flex-col gap-4 contrast-more:border-slate-400 contrast-more:placeholder-slate-500">
            <input
              id="credit_score"
              type="number"
              className="outline-none  rounded-xl p-3 w-full"
              placeholder="Input a credit score from 0 to 100"
              required
              value={dateInputRef}
              onChange={handleCreditScoreChange}
            />
          </form>}
          <div>
            <div className="flex justify-center mt-2 flex-col items-center">
              {mounted && !isMinted && !getHasSoul && (
                <button
                  className="p-2 border bg-violet-200 border-blue-300 w-[200px]  transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110  duration-300 hover:shadow-lg rounded-md   m-4"
                  onClick={() => handleMintButtonClick()}
                >
                  {!proofStatus && "Generate Proof 🎉"}
                  {proofStatus && "Mint"}
                </button>
              )}
            </div>
            <div className="flex mt-6 flex-col gap-2">
              <p className="font-bold text-xl">Status ℹ️ :</p>
              <div
                className={`flex rounded-xl font-semibold text-sm justify-between border ${
                  getHasSoul
                    ? `border-green-200 bg-green-100`
                    : `border-red-200 bg-red-100`
                }  p-4 items-center `}
              >
                <p>SLT </p>
                <p
                  className={`${
                    getHasSoul ? `bg-green-400` : `bg-red-400 text-white`
                  }  rounded-full px-3 py-1`}
                >
                  {getHasSoul ? "Minted" : "Not Minted"}
                </p>
              </div>

              {getHasSoul ? (
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
                      getVerificationStatus
                        ? `bg-green-400`
                        : `bg-red-400 text-white`
                    }  rounded-full px-3 py-1`}
                  >
                    {getVerificationStatus ? "Verified" : "Not Verified"}
                  </p>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
          <p className="select-none italic opacity-80 mt-3  text-center text-xs font-semibold">
            {totalMinted} Proof of Age ZK SLT minted so far!
          </p>
        </div>
      </div>
    </>
  );
};
export default CreditScore;
