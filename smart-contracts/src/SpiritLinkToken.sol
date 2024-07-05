// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interface/IVerifier.sol";

contract SpiritLink is Ownable {
    string public name;
    string public symbol;
    uint256 public totalSLT;

    struct Proof {
        uint256[2] a;
        uint256[2][2] b;
        uint256[2] c;
        uint256[2] input;
    }

    mapping(address => Proof) private spirits;

    event Mint(address user_);
    event Burn(address user_);
    event Update(address user_);

    modifier isValidAddress(address address_) {
        require(address_ != address(0), "Not valid address");
        _;
    }

    constructor() {
        name = "SpiritLink";
        symbol = "SLT";
    }

    function mint(uint256[2] memory a, uint256[2][2] memory b, uint256[2] memory c, uint256[2] memory input)
        external
        virtual
    {
        require(!hasSpirit(msg.sender), "Spirit already exists");

        Proof memory userData = Proof(a, b, c, input);
        spirits[msg.sender] = userData;
        totalSLT++;
        emit Mint(msg.sender);
    }

    function burn(address user_) external virtual onlyOwner isValidAddress(user_) {
        require(hasSpirit(user_), "Spirit does not exist");
        delete spirits[user_];
        totalSLT--;
        emit Burn(user_);
    }

    function updateSLT(address user_, Proof memory userData) public isValidAddress(user_) returns (bool) {
        require(hasSpirit(user_), "Spirit does not exist");

        spirits[user_] = userData;
        emit Update(user_);
        return true;
    }

    function getSLTData(address user_)
        public
        view
        virtual
        isValidAddress(user_)
        returns (uint256[2] memory, uint256[2][2] memory, uint256[2] memory, uint256[2] memory)
    {
        return (spirits[user_].a, spirits[user_].b, spirits[user_].c, spirits[user_].input);
    }

    function validateAttribute(address user_, address verifierAddress) public view returns (bool) {
        require(hasSpirit(user_), "Spirit does not exist");

        Proof memory userData = spirits[user_];
        IVerifier verifier = IVerifier(verifierAddress);

        if (verifier.verifyProof(userData.a, userData.b, userData.c, userData.input) == true) {
            return true;
        } else {
            revert("Verification failed");
        }
    }

    function hasSpirit(address user_) public view virtual isValidAddress(user_) returns (bool) {
        return spirits[user_].input[0] != 0;
    }
}
