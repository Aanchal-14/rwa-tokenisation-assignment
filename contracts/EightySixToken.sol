// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EightySixToken is ERC20, Ownable {

    uint256 public immutable maxSupply;
    address public treasury;

    constructor(uint256 _maxSupply) ERC20("EightySixToken", "EST") Ownable(msg.sender){
        require(_maxSupply > 0, "Invalid max supply");
        maxSupply = _maxSupply;
    }

    modifier onlyTreasury() {
        require(msg.sender == treasury, "Not treasury");
        _;
    } 

    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury!= address(0), "Treasury contract cannot be a zero address");
        treasury = _treasury;
    }

    function mint(address to , uint amount) external onlyTreasury {
        require(totalSupply() + amount <= maxSupply, "Max supply exceeded");
        _mint(to , amount);
    }


}