/* eslint-disable no-unused-vars */
/* eslint-disable node/no-missing-import */
/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
import { assert, expect } from "chai";
import { BigNumber } from "ethers";
import { ethers, network, deployments, getNamedAccounts } from "hardhat";
import { Address } from "hardhat-deploy/types";
import { devChains, networkConfig } from "../../helper-hardhat-config";
import { Raffle, VRFCoordinatorV2Mock } from "../../typechain-types";

!devChains.includes(network.name)
  ? describe.skip
  : describe("Raffle", () => {
      let raffle: Raffle;
      let vrfCoordinatorV2Mock: VRFCoordinatorV2Mock;
      let deployer: Address;
      let raffleEntranceFee: BigNumber;

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        raffle = await ethers.getContract("Raffle", deployer);
        vrfCoordinatorV2Mock = await ethers.getContract(
          "VRFCoordinatorV2Mock",
          deployer
        );
      });
      describe("constructor", () => {
        it("creates a proper Raffle contract", async () => {
          const raffleState: number = await raffle.getRaffleState();
          const raffleInterval: BigNumber = await raffle.getInterval();
          raffleEntranceFee = await raffle.getEntranceFee();
          assert.equal(raffleState.toString(), "0");
          assert.equal(
            raffleInterval.toString(),
            networkConfig[network.name].raffleInterval?.toString()
          );
        });
        describe("enterRaffle", () => {
          it("should revert, if too less ETH sent when trying to enter the raffle", async () => {
            await expect(raffle.enterRaffle()).to.be.revertedWith(
              "Raffle__NotEnoughEthEntered()"
            );
          });
          it("should be able to record a user when entering the raffle", async () => {
            await raffle.enterRaffle({ value: raffleEntranceFee });
            const lastAddedPlayer: Address = await raffle.getPlayer(0);
            assert.equal(lastAddedPlayer, deployer);
          });
          it("should emit an event when a player enters the raffle", async () => {
            await expect(
              raffle.enterRaffle({ value: raffleEntranceFee })
            ).to.emit(raffle, "RaffleEnter");
          });
        });
      });
    });
