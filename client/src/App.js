import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Proofs from "./pages/proofs";
import Main from "./pages/main";
import MyProofs from "./pages/myproofs";



function App() {
  return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/proofs" element={<Proofs />} />
            <Route path="/myproofs" element={<MyProofs />} />
          </Routes>
        </BrowserRouter>
      // </ConnectKitProvider>
  );
}

export default App;