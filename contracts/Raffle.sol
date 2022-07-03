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

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

/* Errors */
error Raffle__NotEnoughEthEntered();
error Raffle__TransferToWinnerFailed();

contract Raffle is VRFConsumerBaseV2 {
    /* state variables */
    uint256 private immutable i_EntranceFee;
    address payable[] private s_Players;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_KeyHash;
    uint64 private immutable i_SubscriptionId;
    uint32 private immutable i_CallbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    address private s_RecentWinner;

    /* Events */
    event RaffleEnter(address indexed player);
    event RandomWordRequest(uint256 indexed requestId);
    event WinnerPicked(address indexed winner);

    constructor(
        address vrfCoordinatorV2,
        uint256 entranceFee,
        bytes32 keyHash,
        uint64 subscriptionId,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_EntranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_KeyHash = keyHash;
        i_SubscriptionId = subscriptionId;
        i_CallbackGasLimit = callbackGasLimit;
    }

    function enterRaffle() public payable {
        if (msg.value < i_EntranceFee) {
            revert Raffle__NotEnoughEthEntered();
        }
        s_Players.push(payable(msg.sender));
        emit RaffleEnter(msg.sender);
    }

    function requestRandomWinner() external {
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_KeyHash,
            i_SubscriptionId,
            REQUEST_CONFIRMATIONS,
            i_CallbackGasLimit,
            NUM_WORDS
        );
        emit RandomWordRequest(requestId);
    }

    function fulfillRandomWords(
        uint256, /*requestId*/
        uint256[] memory randomWords
    ) internal override {
        uint256 indexOfWinner = randomWords[0] % s_Players.length;
        address payable recentWinner = s_Players[indexOfWinner];
        s_RecentWinner = recentWinner;
        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        if (!success) {
            revert Raffle__TransferToWinnerFailed();
        }
        emit WinnerPicked(s_RecentWinner);
    }

    /* view / pure functions */
    function getEntranceFee() public view returns (uint256) {
        return i_EntranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_Players[index];
    }

    function getRecentWinner() public view returns (address) {
        return s_RecentWinner;
    }
}
