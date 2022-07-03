/** @title A smart contract for a trust-minimized lottery
 * @author mme022
 * @notice This smart contract is for demo purpose only
 * @dev
 * user should be able to enter the lottery
 * user should pay some eth to enther the lottery
 * winner should be picked randomly
 * winner should be picked in a set interval
 * plan: using Chainlink Oracles for randomness and automated execution (Keepers)
 */

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

error Raffle__NotEnoughEthEntered();

contract Raffle {
    uint256 private immutable i_EntranceFee;
    address payable[] private s_Players;

    constructor(uint256 entranceFee) {
        i_EntranceFee = entranceFee;
    }

    function enterRaffle() public payable {
        if (msg.value < i_EntranceFee) {
            revert Raffle__NotEnoughEthEntered();
        }
        s_Players.push(payable(msg.sender));
    }

    //function pickWinner() public {}
    function getEntranceFee() public view returns (uint256) {
        return i_EntranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_Players[index];
    }
}
