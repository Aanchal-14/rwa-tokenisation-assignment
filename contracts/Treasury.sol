// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IEightySixToken {
    function mint(address to, uint256 amount) external;
}

contract Treasury is Ownable{

    IEightySixToken public immutable token;
    uint256 public rate;

    event Deposit(address indexed depositer, uint256 ethAmount, uint256 tokensMinted);
    event Withdraw(address indexed owner, uint256 amount);

    constructor(address _tokenAddress, uint256 _rate) Ownable(msg.sender){
        require(_tokenAddress != address(0), "Invalid token");
        require(_rate > 0, "Invalid rate");
        token = IEightySixToken(_tokenAddress);
        rate = _rate;
       
    }


    function setRate(uint256 _rate) external onlyOwner {
        require(_rate>0, "Rate cannot be zero.");
        rate = _rate;
    }

    function deposit(uint256 minTokensOut) external payable {
        require(msg.value > 0, "Zero deposit");
        uint256 tokensToMint = msg.value * rate;
        require(tokensToMint >= minTokensOut, "Slippage");
        token.mint(msg.sender, tokensToMint);
        emit Deposit(msg.sender, msg.value, tokensToMint);
    }

    function withdraw(uint256 amount) external onlyOwner{
        require(amount <= address(this).balance, "Insufficient balance");
        (bool success,) = payable(owner()).call{value:amount}("");
        require(success, "Transaction reverted");

        emit Withdraw(owner(), amount);
    }



}