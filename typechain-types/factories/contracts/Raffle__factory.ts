/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { Raffle, RaffleInterface } from "../../contracts/Raffle";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "vrfCoordinatorV2",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "entranceFee",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "have",
        type: "address",
      },
      {
        internalType: "address",
        name: "want",
        type: "address",
      },
    ],
    name: "OnlyCoordinatorCanFulfill",
    type: "error",
  },
  {
    inputs: [],
    name: "Raffle__NotEnoughEthEntered",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
    ],
    name: "RaffleEnter",
    type: "event",
  },
  {
    inputs: [],
    name: "enterRaffle",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getEntranceFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getPlayer",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "requestId",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "randomWords",
        type: "uint256[]",
      },
    ],
    name: "rawFulfillRandomWords",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "requestRandomWinner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60c060405234801561001057600080fd5b5060405161080138038061080183398181016040528101906100329190610113565b818073ffffffffffffffffffffffffffffffffffffffff1660808173ffffffffffffffffffffffffffffffffffffffff1660601b81525050508060a081815250505050610153565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006100aa8261007f565b9050919050565b6100ba8161009f565b81146100c557600080fd5b50565b6000815190506100d7816100b1565b92915050565b6000819050919050565b6100f0816100dd565b81146100fb57600080fd5b50565b60008151905061010d816100e7565b92915050565b6000806040838503121561012a5761012961007a565b5b6000610138858286016100c8565b9250506020610149858286016100fe565b9150509250929050565b60805160601c60a0516106786101896000396000818161010501526101eb01526000818161012b015261017f01526106786000f3fe60806040526004361061004a5760003560e01c806309bc33a71461004f5780631fe543e31461007a5780632cfcc539146100a3578063522a1f0b146100ad578063e55ae4e8146100c4575b600080fd5b34801561005b57600080fd5b50610064610101565b6040516100719190610351565b60405180910390f35b34801561008657600080fd5b506100a1600480360381019061009c9190610505565b610129565b005b6100ab6101e9565b005b3480156100b957600080fd5b506100c26102eb565b005b3480156100d057600080fd5b506100eb60048036038101906100e69190610561565b6102ed565b6040516100f891906105cf565b60405180910390f35b60007f0000000000000000000000000000000000000000000000000000000000000000905090565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146101db57337f00000000000000000000000000000000000000000000000000000000000000006040517f1cf993f40000000000000000000000000000000000000000000000000000000081526004016101d29291906105ea565b60405180910390fd5b6101e58282610334565b5050565b7f0000000000000000000000000000000000000000000000000000000000000000341015610243576040517f066d781f00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000339080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503373ffffffffffffffffffffffffffffffffffffffff167f0805e1d667bddb8a95f0f09880cf94f403fb596ce79928d9f29b74203ba284d460405160405180910390a2565b565b600080828154811061030257610301610613565b5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b5050565b6000819050919050565b61034b81610338565b82525050565b60006020820190506103666000830184610342565b92915050565b6000604051905090565b600080fd5b600080fd5b61038981610338565b811461039457600080fd5b50565b6000813590506103a681610380565b92915050565b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6103fa826103b1565b810181811067ffffffffffffffff82111715610419576104186103c2565b5b80604052505050565b600061042c61036c565b905061043882826103f1565b919050565b600067ffffffffffffffff821115610458576104576103c2565b5b602082029050602081019050919050565b600080fd5b600061048161047c8461043d565b610422565b905080838252602082019050602084028301858111156104a4576104a3610469565b5b835b818110156104cd57806104b98882610397565b8452602084019350506020810190506104a6565b5050509392505050565b600082601f8301126104ec576104eb6103ac565b5b81356104fc84826020860161046e565b91505092915050565b6000806040838503121561051c5761051b610376565b5b600061052a85828601610397565b925050602083013567ffffffffffffffff81111561054b5761054a61037b565b5b610557858286016104d7565b9150509250929050565b60006020828403121561057757610576610376565b5b600061058584828501610397565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006105b98261058e565b9050919050565b6105c9816105ae565b82525050565b60006020820190506105e460008301846105c0565b92915050565b60006040820190506105ff60008301856105c0565b61060c60208301846105c0565b9392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fdfea2646970667358221220eb701f34252a4fff2084b156c2c8b238d73bb7b994b593d02b4dca39a820995264736f6c63430008080033";

type RaffleConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: RaffleConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Raffle__factory extends ContractFactory {
  constructor(...args: RaffleConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    vrfCoordinatorV2: PromiseOrValue<string>,
    entranceFee: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Raffle> {
    return super.deploy(
      vrfCoordinatorV2,
      entranceFee,
      overrides || {}
    ) as Promise<Raffle>;
  }
  override getDeployTransaction(
    vrfCoordinatorV2: PromiseOrValue<string>,
    entranceFee: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      vrfCoordinatorV2,
      entranceFee,
      overrides || {}
    );
  }
  override attach(address: string): Raffle {
    return super.attach(address) as Raffle;
  }
  override connect(signer: Signer): Raffle__factory {
    return super.connect(signer) as Raffle__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RaffleInterface {
    return new utils.Interface(_abi) as RaffleInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Raffle {
    return new Contract(address, _abi, signerOrProvider) as Raffle;
  }
}
