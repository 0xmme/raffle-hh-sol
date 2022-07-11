/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-unpublished-import */
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  DeployFunction,
  DeployedContract,
  Address,
} from "hardhat-deploy/types";
import { ethers, network } from "hardhat";
import { devChains, networkConfig } from "../helper-hardhat-config";
import { BigNumber } from "ethers";
import verify from "../utils/verify/verify";

const deployFunc: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  // env variables
  const { getNamedAccounts, deployments } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  // vrf Coordinator variables
  let vrfCoordinatorV2Address: Address | String;
  const entranceFee: BigNumber = networkConfig[network.name].entranceFee!;
  const gasLane: String = networkConfig[network.name].gasLane!;
  let subscriptionId;
  const callbackGasLimit: number =
    networkConfig[network.name].callbackGasLimit!;
  const raffleInterval: number = networkConfig[network.name].raffleInterval!;

  log("check for network and deploy Mocks to local testnet if necessary...");
  if (devChains.includes(network.name)) {
    const VRFCoordinatorV2Mock = await ethers.getContract(
      "VRFCoordinatorV2Mock"
    );
    vrfCoordinatorV2Address = VRFCoordinatorV2Mock.address;
    const txResponse = await VRFCoordinatorV2Mock.createSubscription();
    const txReceipt = await txResponse.wait();

    subscriptionId = txReceipt.events[0].args.subId;
    await VRFCoordinatorV2Mock.fundSubscription(
      subscriptionId,
      ethers.utils.parseEther("2")
    );
  }
  // if we are on a testnet or livenet:
  else {
    vrfCoordinatorV2Address = networkConfig[network.name].vrfCoordinatorV2!;
    subscriptionId = networkConfig[network.name].subscriptionId!;
  }

  const argsArr: any = [
    vrfCoordinatorV2Address,
    entranceFee,
    gasLane,
    subscriptionId,
    callbackGasLimit,
    raffleInterval,
  ];

  log("deploying raffle contract...");
  const Raffle: DeployedContract = await deploy("Raffle", {
    from: deployer,
    args: argsArr,
    log: true,
    waitConfirmations: networkConfig[network.name].blockConfirmations,
  });
  log(Raffle.address);

  if (!devChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log(
      "verifying the contract on Etherscan, when deployed on testnet or mainnet"
    );
    await verify(Raffle.address, argsArr);
  }
};

export default deployFunc;

deployFunc.tags = ["all", "raffle"];
