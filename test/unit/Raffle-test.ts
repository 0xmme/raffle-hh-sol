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
      let raffleInterval: BigNumber;

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
          raffleInterval = await raffle.getInterval();
          raffleEntranceFee = await raffle.getEntranceFee();
          assert.equal(raffleState.toString(), "0");
          assert.equal(
            raffleInterval.toString(),
            networkConfig[network.name].raffleInterval!.toString()
          );
        });
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

        it("doesn't allow enter when raffle is not open", async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send("evm_increaseTime", [
            raffleInterval.toNumber() + 1,
          ]);
          await network.provider.send("evm_mine", []);
          await raffle.performUpkeep([]);
          await expect(
            raffle.enterRaffle({ value: raffleEntranceFee })
          ).to.be.revertedWith("Raffle__RaffleNotOpen()");
        });
      });

      describe("checkUpkeep", () => {
        it("should return false, if people haven't send enough ETH", async () => {
          await network.provider.send("evm_increaseTime", [
            raffleInterval.toNumber() + 1,
          ]);
          await network.provider.send("evm_mine", []);
          const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([]);
          assert(!upkeepNeeded);
        });

        it("should return false, if raffle state is not open", async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send("evm_increaseTime", [
            raffleInterval.toNumber() + 1,
          ]);
          await network.provider.send("evm_mine", []);
          await raffle.performUpkeep([]);
          const raffleState = raffle.getRaffleState();
          const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([]);
          assert.equal((await raffleState).toString(), "1");
          assert.equal(upkeepNeeded, false);
        });

        it("should return false, if not enough time has passed", async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          const blockNumBefore = await ethers.provider.getBlockNumber();
          const blockBefore = await ethers.provider.getBlock(blockNumBefore);
          const timestampBefore = blockBefore.timestamp;
          await network.provider.send("evm_increaseTime", [
            raffleInterval.toNumber() - 1,
          ]);
          await network.provider.send("evm_mine", []);
          const blockNumNow = await ethers.provider.getBlockNumber();
          const blockNow = await ethers.provider.getBlock(blockNumNow);
          const timestampNow = blockNow.timestamp;
          expect(timestampNow - timestampBefore).is.lessThan(
            raffleInterval.toNumber()
          );
          const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([]);
          assert(!upkeepNeeded);
        });

        it("should return true if enough time has passed, enough eth is in the pot, the raffle is in an open state and enough players have entered", async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send("evm_increaseTime", [
            raffleInterval.toNumber() + 1,
          ]);
          await network.provider.send("evm_mine", []);
          const { upkeepNeeded } = await raffle.callStatic.checkUpkeep([]);
          assert(upkeepNeeded);
        });
      });

      describe("performUpkeep", () => {
        it("should not be executed if checkUpkeep returns false", async () => {
          await network.provider.send("evm_increaseTime", [
            raffleInterval.toNumber() + 1,
          ]);
          await network.provider.send("evm_mine", []);
          expect(raffle.performUpkeep([])).to.be.revertedWith(
            "Raffle__NoUpkeepNeeded"
          );
        });

        it("should only be executed if checkUpkeep returns true", async () => {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          await network.provider.send("evm_increaseTime", [
            raffleInterval.toNumber() + 1,
          ]);
          await network.provider.send("evm_mine", []);
          const txResponse = await raffle.performUpkeep([]);
          assert(txResponse);
        });
      });
    });
