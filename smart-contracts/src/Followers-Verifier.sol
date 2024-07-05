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

contract FollowerVerifier is IVerifier {
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
            21331710546022874036436356449988531464506835012831601375370219107120907684961,
            10701282628152973814553406786025850221023901862639723007223051949347669401182
        );

        vk.beta2 = Proofs.G2Point(
            [12319821158929679420617009123527438441259001649451867713779757112417364262370,
             21816171774849052380157559077674552157512592375244953693667312827610640851258],
            [21755128338274223531984202873389638757862801796910939019643054185193386735265,
             6474326072493305312245266938927272895056731567639465703653582531128898858178]
        );
        vk.gamma2 = Proofs.G2Point(
            [11559732032986387107991004021392285783925812861821192530917403151452391805634,
             10857046999023057135944570762232829481370756359578518086990519993285655852781],
            [4082367875863433681332203403145435568316851327593401208105741076214120093531,
             8495653923123431417604973247489272438418190587263600148770280649306958101930]
        );
        vk.delta2 = Proofs.G2Point(
            [16432020284338443756383948445934861656540114283194843495909282989357962892834,
             11867284563927774329193563047343864489831623090442376031892698275554211748234],
            [16601614059268707404474436142673586488063011183052784973898213310977018932372,
             1675808022576713266554028102236314930347014454917907190683542647588802333190]
        );
        vk.IC = new Proofs.G1Point[](3);
        
        vk.IC[0] = Proofs.G1Point( 
            1633267950562543905004261696877657121134839012637974843733491150119029832559,
            11254118063316322239334327345819369401890676103455111832235339634392171275668
        );                                      
        
        vk.IC[1] = Proofs.G1Point( 
            15067659348576663839051603498818324451438641947832012483823211175956044404040,
            1796842946561292511768128997032072679978425675864874765726875166561575772841
        );                                      
        
        vk.IC[2] = Proofs.G1Point( 
            20736430269738551704143420560416816204147099473683378963747250700351145336084,
            13974655815534722960468697257498871924520679790389696154591106729634389570408
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
