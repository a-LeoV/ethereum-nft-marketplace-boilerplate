import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useEffect, useState } from "react";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import { useAPIContract } from "hooks/useAPIContract";

export const useIsApproved = () => {

const { chainId, crContractABI, crAddress, mrAddress, mrContractABI, walletAddress } = useMoralisDapp();
const isApprovedForAllFunction = "isApprovedForAll";
const [isApproved, setIsApproved] = useState(Boolean);
const { native } = useMoralisWeb3Api();
const ABI =  (`[{
  "inputs": [
    {
      "internalType": "address",
      "name": "owner",
      "type": "address"
    },
    {
      "internalType": "address",
      "name": "operator",
      "type": "address"
    }
  ],
  "name": "isApprovedForAll",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "stateMutability": "view",
  "type": "function"
}]`);
const options = {
    chain: chainId,
    contractAddress: crAddress,
    functionName: isApprovedForAllFunction,
    abi: ABI,
  params : {
      owner: walletAddress,
      operator: mrAddress,
  }
  };
  
  const {
    fetch: getIsApproved,
    data,
    error,
    isLoading,
  } = useMoralisWeb3ApiCall(native.runContractFunction, { ...options });
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
