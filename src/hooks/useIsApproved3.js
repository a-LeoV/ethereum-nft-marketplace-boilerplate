import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useEffect, useState } from "react";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import { useAPIContract } from "hooks/useAPIContract";
import { Moralis } from "moralis"

export const useIsApproved = async () => {

const { chainId, crContractABI, crAddress, mrAddress, mrContractABI, walletAddress } = useMoralisDapp();
const isApprovedForAllFunction = "isApprovedForAll";
const [isApproved, setIsApproved] = useState(Boolean);
const crContractABIJson = JSON.parse(crContractABI);
let options = {
  chain: chainId,
  contractAddress: crAddress,
  functionName: isApprovedForAllFunction,
  abi: crContractABIJson,
params : { owner: walletAddress, operator: mrAddress}
};

const { native } = useMoralisWeb3Api();


const {
  fetch: getIsApproved,
  data,
  error,
  isLoading,
} = await Moralis.Web3API.native.runContractFunction({ options });
const [fetchSuccess, setFetchSuccess] = useState(true);

useEffect( () => {
  if (data) {
    
    
    setFetchSuccess(true);   
    setIsApproved(data);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [data]);
  
  return { getIsApproved, isApproved, fetchSuccess, error, isLoading};

};
