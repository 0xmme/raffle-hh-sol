/* eslint-disable no-async-promise-executor */
/* eslint-disable no-unused-vars */
/* eslint-disable node/no-missing-import */
/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { BigNumber, ContractReceipt, ContractTransaction } from "ethers";
import { ethers, network, deployments, getNamedAccounts } from "hardhat";
import { Address } from "hardhat-deploy/types";
import { devChains, networkConfig } from "../../helper-hardhat-config";
import { Raffle } from "../../typechain-types";

devChains.includes(network.name)
  ? describe.skip
  : describe("Raffle", () => {
      let raffle: Raffle;
      let deployer: Address;
      let raffleEntranceFee: BigNumber;

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        raffle = await ethers.getContract("Raffle", deployer);
        raffleEntranceFee = await raffle.getEntranceFee();
      });

      describe("fulfillRandomwords", () => {
        it("should work with live Chainlink Keepers & VRF, picks a winner", async () => {
          const startTimestamp: BigNumber = await raffle.getLastTimestamp();
          const accounts: SignerWithAddress[] = await ethers.getSigners();
          const deployer: SignerWithAddress = accounts[0];

          await new Promise<void>(async function (resolve, reject) {
            raffle.once("WinnerPicked", async () => {
              console.log("WinnerPicked Event triggered...");
              try {
                const recentWinner: Address = await raffle.getRecentWinner();
                const raffleState: number = await raffle.getRaffleState();
                const endTimestamp: BigNumber = await raffle.getLastTimestamp();
                const winnerEndBal: BigNumber = await deployer.getBalance();

                console.log(recentWinner);

                await expect(raffle.getPlayer(0)).to.be.reverted;
                assert.equal(recentWinner, deployer.address);
                assert.equal(raffleState, 0);
                assert.equal(
                  winnerStartBal,
                  winnerEndBal.add(raffleEntranceFee)
                );
                assert(endTimestamp > startTimestamp);
                resolve();
              } catch (error) {
                reject(error);
              }
            });
            await raffle.enterRaffle({ value: raffleEntranceFee });
            const txResponse: ContractTransaction = await raffle.performUpkeep(
              []
            );
            const txReceipt: ContractReceipt = await txResponse.wait(1);
            const winnerStartBal: BigNumber = await deployer.getBalance();
          });
        });
      });
    });
