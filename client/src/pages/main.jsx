import Navbar from "../components/navbar";

const Main = () => {
  return (
    <div className="h-[100vh] w-full bg-gradient-to-r from-blue-400 to-cyan-400">
      <Navbar />

      <p className="text-8xl text-center mt-[10vh] font-bold p-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400  to-cyan-400  ">
        {" "}
        Tokenize your Identity
      </p>
      <p className="text-center px-[15vw] font-bold text-4xl text-[#191919] mt-8">
        Elevate Security, Simplify Identity - Zero Compromises, Zero Worries, Zero Knowledge Proof!
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
