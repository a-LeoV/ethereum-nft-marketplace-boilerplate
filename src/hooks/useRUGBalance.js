import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useEffect, useState } from "react";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import { useIPFS } from "./useIPFS";


export const useRUGBalance = () => {
    const { account } = useMoralisWeb3Api();
    const { chainId, walletAddress } = useMoralisDapp();
    const { resolveLink } = useIPFS();
    const [RUGBalance, setRUGBalance] = useState([]);
    const {
      fetch: getRUGBalance,
      data,
      error,
      isLoading,
    } = useMoralisWeb3ApiCall(account.getNFTsForContract, { chain: chainId, address: walletAddress, token_address: "0xBe169ba8097583318A84014657eEcB5b32b283B8" });

  useEffect(() => {
    if (data?.result) {
      const NFTs = data.result;
      for (let NFT of NFTs) {
        if (NFT?.metadata) {
          NFT.metadata = JSON.parse(NFT.metadata);
          // metadata is a string type
          NFT.image = resolveLink(NFT.metadata?.image);
        }
      }
      setRUGBalance(NFTs);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return { getRUGBalance, RUGBalance, error, isLoading };
};
