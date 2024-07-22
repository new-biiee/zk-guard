import { Toaster, toast } from "react-hot-toast";
import { ethers } from "ethers";
import dobToAge from "dob-to-age";
import React from "react";
import axios from "axios";
import {zkGuardContractConfigAge, verifierContractAddressAge} from "../config"

const AgeVerification = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const dateInputRef = React.useRef(null);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(zkGuardContractConfigAge.address, zkGuardContractConfigAge.abi, signer);

  const [proofStatus, setProofStatus] = React.useState(false);
  const [isMinted, setIsMinted] = React.useState(false);
  const [getAge, setAge] = React.useState("");
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

  const addressVerified = async () => {
    try {
      const verified = await contract.validateAttribute(getVerificationAddress, verifierContractAddressAge);
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

    if (!getAge) {
      toast.error("Please enter your date of birth");
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

  function handleDateChange(e) {
    setAge(e.target.value);
  }

  const getCallDataFromServer = React.useCallback(async () => {
    try {
      const age = dobToAge(getAge);
      console.log("dob", getAge);
      console.log("age", age);
      const response = await axios.get(
        `http://localhost:8080/api/age/generate-call-data?age=${age}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return {};
    }
  }, [getAge]);

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
        <img
          className="h-[250px] w-full object-cover rounded-md"
          src="./age.jpeg"
          alt="Age Verification"
        />
        <h1 className="text-xl font-extrabold text-center pt-3 text-blue-800 ">
          Proof Of Age
        </h1>
        <div className="p-3">
        {!getHasSpirit && (
          <form className="h-[100px] items-center justify-center flex flex-col gap-4 contrast-more:border-slate-400 contrast-more:placeholder-slate-500">
            <input
              id="Age"
              type="date"
              className="outline-none rounded-xl p-3 w-full"
              required
              ref={dateInputRef}
              onChange={handleDateChange}
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

export default AgeVerification;
