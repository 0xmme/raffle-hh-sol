/** @title A smart contract for a trust-minimized lottery
 * @author mme022
 * @notice This smart contract was made for demo purpose
 * @dev In this project Chainlink VRF v2 and Chainlink Keepers is used
 */

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

/* Errors */
error Raffle__NotEnoughEthEntered();
error Raffle__TransferToWinnerFailed();
error Raffle__RaffleNotOpen();
error Raffle__NoUpkeepNeeded(
    uint256 balance,
    uint256 playerCount,
    uint256 raffleState
);

contract Raffle is VRFConsumerBaseV2, KeeperCompatibleInterface {
    /* Type declarations */
    enum RaffleState {
        OPEN,
        CLOSED
    }

    /* state variables */
    uint256 private immutable i_EntranceFee;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_KeyHash;
    uint64 private immutable i_SubscriptionId;
    uint32 private immutable i_CallbackGasLimit;
    uint256 private immutable i_Interval;

    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    address payable[] private s_Players;
    address private s_RecentWinner;
    RaffleState private s_RaffleState;
    uint256 private s_LastTimestamp;

    /* Events */
    event RaffleEnter(address indexed player);
    event RandomWordRequest(uint256 indexed requestId);
    event WinnerPicked(address indexed winner);

    constructor(
        address vrfCoordinatorV2,
        uint256 entranceFee,
        bytes32 keyHash,
        uint64 subscriptionId,
        uint32 callbackGasLimit,
        uint256 interval
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_EntranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_KeyHash = keyHash;
        i_SubscriptionId = subscriptionId;
        i_CallbackGasLimit = callbackGasLimit;
        i_Interval = interval;
        s_RaffleState = RaffleState.OPEN;
        s_LastTimestamp = block.timestamp;
    }

    /* functions used for accessing the Raffle, picking a winner and sending the amount won */
    function enterRaffle() public payable {
        if (msg.value < i_EntranceFee) {
            revert Raffle__NotEnoughEthEntered();
        }
        if (s_RaffleState != RaffleState.OPEN) {
            revert Raffle__RaffleNotOpen();
        }
        s_Players.push(payable(msg.sender));
        emit RaffleEnter(msg.sender);
    }

    function checkUpkeep(
        bytes memory /*checkData*/
    )
        public
        view
        override
        returns (
            bool upkeepNeeded,
            bytes memory /*performData*/
        )
    {
        bool isOpen = (s_RaffleState == RaffleState.OPEN);
        bool enoughTimePassed = ((block.timestamp - s_LastTimestamp) >
            i_Interval);
        bool hasPlayers = s_Players.length > 0;
        bool hasBalance = address(this).balance > 0;
        upkeepNeeded = (isOpen && enoughTimePassed && hasBalance && hasPlayers);
        return (upkeepNeeded, "0x0");
    }

    function performUpkeep(
        bytes calldata /*performData*/
    ) external override {
        (bool upkeepNeeded, ) = checkUpkeep("");

        if (!upkeepNeeded) {
            revert Raffle__NoUpkeepNeeded(
                address(this).balance,
                s_Players.length,
                uint256(s_RaffleState)
            );
        }

        s_RaffleState = RaffleState.CLOSED;

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
        s_Players = new address payable[](0);
        s_LastTimestamp = block.timestamp;
        s_RaffleState = RaffleState.OPEN;
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

    function getRaffleState() public view returns (RaffleState) {
        return s_RaffleState;
    }

    function getCurrentBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getPlayerCount() public view returns (uint256) {
        return s_Players.length;
    }

    function getLastTimestamp() public view returns (uint256) {
        return s_LastTimestamp;
    }

    function getInterval() public view returns (uint256) {
        return i_Interval;
    }

    function getNumWords() public pure returns (uint256) {
        return NUM_WORDS;
    }

    function getRequestConfirmations() public pure returns (uint256) {
        return REQUEST_CONFIRMATIONS;
    }
}
