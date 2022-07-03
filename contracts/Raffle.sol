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

//import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

/* Errors */
error Raffle__NotEnoughEthEntered();

contract Raffle is VRFConsumerBaseV2 {
    /* state variables */
    uint256 private immutable i_EntranceFee;
    address payable[] private s_Players;

    /* Events */
    event RaffleEnter(address indexed player);

    constructor(address vrfCoordinatorV2, uint256 entranceFee)
        VRFConsumerBaseV2(vrfCoordinatorV2)
    {
        i_EntranceFee = entranceFee;
    }

    function enterRaffle() public payable {
        if (msg.value < i_EntranceFee) {
            revert Raffle__NotEnoughEthEntered();
        }
        s_Players.push(payable(msg.sender));
        emit RaffleEnter(msg.sender);
    }

    function requestRandomWinner() external {}

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {}

    /* view / pure functions */
    function getEntranceFee() public view returns (uint256) {
        return i_EntranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_Players[index];
    }
}
