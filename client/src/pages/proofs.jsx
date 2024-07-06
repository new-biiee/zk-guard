import AgeVerification from "../components/AgeVerification";
import CreditScore from "../components/CreditScoreProofCard";
import Navbar from "../components/navbar";
import TwitterFollowers from "../components/TwitterProof";
const Proofs = () => {
  return (
    <div className="h-[100vh] w-full bg-gradient-to-r from-blue-400 to-cyan-400">
      <Navbar />
      <p className="text-4xl p-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-black  to-black font-extrabold">
        Proof Generation Hub...!!
      </p>

      <div className="flex gap-4 flex-wrap items-center justify-center">
        <CreditScore />
        <TwitterFollowers />
        <AgeVerification />
      </div>
    </div>
  );
};

export default Proofs;
