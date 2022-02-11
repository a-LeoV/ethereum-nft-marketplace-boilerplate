import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useEffect, useState } from "react";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import { useAPIContract } from "hooks/useAPIContract";

export const useIsApproved = async () => {

const { chainId, crContractABI, crAddress, mrAddress, mrContractABI, walletAddress } = useMoralisDapp();
const isApprovedForAllFunction = "isApprovedForAll";
const crContractABIJson = JSON.parse(crContractABI);
let options = {
  chain: chainId,
  contractAddress: crAddress,
  functionName: isApprovedForAllFunction,
  abi: crContractABIJson,
params : { owner: walletAddress, operator: mrAddress}
};

const { native } = useMoralisWeb3Api();

  let isApproved = await useMoralisWeb3ApiCall(native.runContractFunction, { options });
  
};
