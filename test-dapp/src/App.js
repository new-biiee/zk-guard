import Verify from "./Verify";
import { useState } from "react";
import Web3 from "web3";

function App() {

  return (<>
    <div className="h-[100vh] w-full bg-gradient-to-r from-blue-400 to-cyan-400">
        <div className="flex flex-col gap-2 justify-center items-center">
          <p className="text-5xl px-4 mt-4 text-center bg-clip-text bg-gradient-to-r from-blue-400  to-cyan-400 font-extrabold">
            Prove Your on-chain Identity
          </p>
          <p className="text-center font-extrabold text-xl">
            Powered by zk Guard 🔐
          </p>
         <a href=""> <p className="px-3 py-1 bg-cyan-700 cursor-pointer font-xl rounded-xl text-white underline font-bold">Spirit-Link Verification ↗</p></a>

          <div className="mt-8"> </div>{" "}
        </div>
        <Verify />
        </div>
        </>
  );
}

export default App;
