import Navbar from "../components/navbar";

const Main = () => {
  return (
    <div className="h-[100vh] w-full bg-gradient-to-r from-blue-400 to-cyan-400">
      <Navbar />

      <p className="text-8xl text-center mt-[10vh] font-bold p-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400  to-cyan-400  ">
        {" "}
        Tokenize your Identity
      </p>
      <p className="text-center px-[15vw] font-medium text-lg text-[#191919] mt-[20px]">
        Interact with internet without worring about your Data, Proofs are
        non-transferable tokens (SLTs) that represent verifiable claims
        authenticated by ZKVault. <br />
        <br /> When minting a Proof, a user generates a proof to authenticate an
        anonymized verifiable claim about some data that only they own. Then
        using snarkjs and Groth16 a proof is generated and proof is then
        verified and tokenized as a SLT by zkGuard—smart contracts that convert
        proven data into non-transferable tokens (SLTs) As SLT are issued as
        tokens on-chain, they are compatible with the burgeoning ecosystem of
        web3 applications.As such, Badges represent verified acts about a user’s
        digital identity. For example, a user could have a ZK SLT proving they
        have a certain threshold of Twitter followers
      </p>
      <div
        className="flex justify-center mt-[10vh] gap-4
      "
      >
       <a href="/proofs"> <button className=" w-[170px]  py-3 bg-[#191919] text-white rounded-md font-semibold">
          Mint your own SLT
        </button></a>

        <a href=""><button className=" w-[170px]  py-3 bg-[#191919] text-white rounded-md font-semibold">
          Demo App ↗
        </button></a>
      </div>
    </div>
  );
};

export default Main;
