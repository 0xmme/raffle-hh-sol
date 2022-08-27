/* eslint-disable no-unused-vars */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-unpublished-import */
import { ethers, network } from "hardhat";
import { Address } from "hardhat-deploy/types";
import { Raffle } from "../typechain-types";
import * as fs from "fs";

const contractAddressesFile =
  "../nextjs-raffle-frontend/constants/contractAddresses.json";
const contractAbiFile = "../nextjs-raffle-frontend/constants/abi.json";

const updateContractAddresses = async () => {
  const currentAddresses = JSON.parse(
    fs.readFileSync(contractAddressesFile, "utf8")
  );
  const RaffleContract: Raffle = await ethers.getContract("Raffle");
  const RaffleAddress: Address = RaffleContract.address;
  console.log(RaffleAddress);
  const currentChain = network.config.chainId!;

  if (currentChain in currentAddresses) {
    if (!currentAddresses[currentChain].includes(RaffleAddress)) {
      currentAddresses[currentChain].push(RaffleAddress);
    }
  } else {
    currentAddresses[currentChain] = [RaffleAddress];
  }
  fs.writeFileSync(contractAddressesFile, JSON.stringify(currentAddresses));
};

const updateAbi = async () => {
  const RaffleContract: Raffle = await ethers.getContract("Raffle");
  const abi = RaffleContract.interface.format(ethers.utils.FormatTypes.json);
  if (typeof abi === "string") {
    fs.writeFileSync(contractAbiFile, abi);
  }
};

const updateFrontend = async () => {
  if (process.env.UPDATE_FRONTEND) {
    console.log("updating frontend...");
    updateContractAddresses();
    updateAbi();
  }
};

export default updateFrontend;
updateFrontend.tags = ["all", "frontend"];
