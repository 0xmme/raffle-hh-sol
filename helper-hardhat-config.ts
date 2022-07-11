/* eslint-disable node/no-unpublished-import */
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

export interface networkConfigItem {
  vrfCoordinatorV2?: String;
  blockConfirmations?: number;
  entranceFee?: BigNumber;
  gasLane?: String;
  subscriptionId?: number;
  callbackGasLimit?: number;
  raffleInterval?: number;
}

export interface networkConfigInfo {
  [key: string]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
  localhost: {
    blockConfirmations: 1,
    entranceFee: ethers.utils.parseEther("1"),
    gasLane:
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
    subscriptionId: 0,
    callbackGasLimit: 500000,
    raffleInterval: 30,
  },
  hardhat: {
    blockConfirmations: 1,
    entranceFee: ethers.utils.parseEther("1"),
    gasLane:
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
    subscriptionId: 0,
    callbackGasLimit: 500000,
    raffleInterval: 30,
  },
  rinkeby: {
    vrfCoordinatorV2: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
    blockConfirmations: 6,
    entranceFee: ethers.utils.parseEther("0.01"),
    gasLane:
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
    subscriptionId: 0,
    callbackGasLimit: 500000,
    raffleInterval: 30,
  },
};

export const devChains = ["hardhat", "localhost"];
export const DECIMALS = 8;
export const INITIAL_ANSWER = 200000000000;
