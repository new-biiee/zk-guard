//
// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// 2019 OKIMS
//      ported to solidity 0.6
//      fixed linter warnings
//      added requiere error messages
//
//
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import "./lib/ProofsLib.sol";
import "./interface/IVerifier.sol";

contract CreditScoreVerifier is IVerifier {
    using Proofs for *;
    struct VerifyingKey {
        Proofs.G1Point alfa1;
        Proofs.G2Point beta2;
        Proofs.G2Point gamma2;
        Proofs.G2Point delta2;
        Proofs.G1Point[] IC;
    }
    struct Proof {
        Proofs.G1Point A;
        Proofs.G2Point B;
        Proofs.G1Point C;
    }
    function verifyingKey() internal pure returns (VerifyingKey memory vk) {
        vk.alfa1 = Proofs.G1Point(
            18552587650484604297318461538987602682984769173849790657053746067296158207215,
            9389361285836306726538255584981617579612798665556927841863014721452386618658
        );

        vk.beta2 = Proofs.G2Point(
            [4443613025090961762296562462687032459092008865083145679792570853097632252063,
             12800942618699475686810472046769195275852906793680036992116141103311707619304],
            [18397328455680469341420458515102810571154109650381087340643403482653535903948,
             15203230325017178567411715958131302013701911345065606794455621034985983209525]
        );
        vk.gamma2 = Proofs.G2Point(
            [11559732032986387107991004021392285783925812861821192530917403151452391805634,
             10857046999023057135944570762232829481370756359578518086990519993285655852781],
            [4082367875863433681332203403145435568316851327593401208105741076214120093531,
             8495653923123431417604973247489272438418190587263600148770280649306958101930]
        );
        vk.delta2 = Proofs.G2Point(
            [12219746290801652081668387470116591027192093349757606728914794884613819270890,
             18736777670367083310546926401624351680615181772914735874122972815477092226188],
            [12608502682677921967635563582575761004998211007135031974613467853068635522468,
             11917094116097108865149904920245939087591128338213947915821306204825059118844]
        );
        vk.IC = new Proofs.G1Point[](3);
        
        vk.IC[0] = Proofs.G1Point( 
            3951723994883148066832594014501456313516113937004987014710217070188228054214,
            11318345398606550561710690233928804107014472475417370716393439024469533513247
        );                                      
        
        vk.IC[1] = Proofs.G1Point( 
            7310396239625070235390004165805519146254834424681391574445256958873840644586,
            15558672504739385589617999609846341722191644868642488552467314013409737168385
        );                                      
        
        vk.IC[2] = Proofs.G1Point( 
            8185284611471105900659551562123160626462922076881052229442365533665290831272,
            9603871253301626266038760741056885917358004608401739967239544339919051831081
        );                                      
        
    }
    function verify(uint[] memory input, Proof memory proof) internal view returns (uint) {
        uint256 snark_scalar_field = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
        VerifyingKey memory vk = verifyingKey();
        require(input.length + 1 == vk.IC.length,"verifier-bad-input");
        // Compute the linear combination vk_x
        Proofs.G1Point memory vk_x = Proofs.G1Point(0, 0);
        for (uint i = 0; i < input.length; i++) {
            require(input[i] < snark_scalar_field,"verifier-gte-snark-scalar-field");
            vk_x = Proofs.addition(vk_x, Proofs.scalar_mul(vk.IC[i + 1], input[i]));
        }
        vk_x = Proofs.addition(vk_x, vk.IC[0]);
        if (!Proofs.pairingProd4(
            Proofs.negate(proof.A), proof.B,
            vk.alfa1, vk.beta2,
            vk_x, vk.gamma2,
            proof.C, vk.delta2
        )) return 1;
        return 0;
    }
    /// @return r  bool true if proof is valid
    function verifyProof(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[2] memory input
        ) public view returns (bool r) {
        Proof memory proof;
        proof.A = Proofs.G1Point(a[0], a[1]);
        proof.B = Proofs.G2Point([b[0][0], b[0][1]], [b[1][0], b[1][1]]);
        proof.C = Proofs.G1Point(c[0], c[1]);
        uint[] memory inputValues = new uint[](input.length);
        for(uint i = 0; i < input.length; i++){
            inputValues[i] = input[i];
        }
        if (verify(inputValues, proof) == 0) {
            return true;
        } else {
            return false;
        }
    }
}
