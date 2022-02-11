import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useState } from "react";

export const useAPIContract = async (options) => {
  const { native } = useMoralisWeb3Api();
  const { chainId, crContractABI, crAddress, mrAddress, mrContractABI, walletAddress } = useMoralisDapp();
  const crContractABIJson = JSON.parse(crContractABI);
  const isApprovedForAllFunction = "isApprovedForAll";
  let [isApproved, setIsApproved] = useState();

  const {
    fetch: runContractFunction,
    data,
    error,
    isLoading,
  } = await useMoralisWeb3ApiCall(native.runContractFunction, {   chain: chainId,
    contractAddress: crAddress,
    functionName: isApprovedForAllFunction,
    abi: crContractABIJson, ...options, owner: walletAddress,
    operator: mrAddress, });

    setIsApproved = JSON.parse(data)

  return { runContractFunction, isApproved, error, isLoading };
};
