import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useEffect, useState } from "react";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import { useIPFS } from "./useIPFS";

export const useRUGBalance2 = (options) => {
  const { account } = useMoralisWeb3Api();
  const { chainId, walletAddress } = useMoralisDapp();
  const { resolveLink } = useIPFS();
  const [RUGBalance, setRUGBalance] = useState([]);
  const [totalNFTs, setTotalNFTs] = useState();
  const {
    fetch: getRUGBalance,
    data,
    error,
    isLoading,
  } = useMoralisWeb3ApiCall(account.getNFTsForContract, { chain: chainId, ...options, token_address: "0xBe169ba8097583318A84014657eEcB5b32b283B8" });
  const [fetchSuccess, setFetchSuccess] = useState(true);

  useEffect(async () => {
    if (data?.result) {
      
      const NFTs = data.result;
      setFetchSuccess(true);
      setTotalNFTs(data.total);
      for (let NFT of NFTs) {
        if (NFT?.metadata) {
          NFT.metadata = JSON.parse(NFT.metadata);
          NFT.image = resolveLink(NFT.metadata?.image);
        } else if (NFT?.token_uri) {
          try {
            await fetch(NFT.token_uri)
              .then((response) => response.json())
              .then((data) => {
                NFT.image = resolveLink(data.image);
              });
          } catch (error) {
            setFetchSuccess(false);

/*          !!Temporary work around to avoid CORS issues when retrieving NFT images!!
            Create a proxy server as per https://dev.to/terieyenike/how-to-create-a-proxy-server-on-heroku-5b5c
            Replace <your url here> with your proxy server_url below
            Remove comments :)
*/
              try {
                await fetch(`https://fierce-mountain-52440.herokuapp.com/${NFT.token_uri}`)
                .then(response => response.json())
                .then(data => {
                  NFT.image = resolveLink(data.image);
                });
              } catch (error) {
                setFetchSuccess(false);
              }

 
          }
        }
      }
      setRUGBalance(NFTs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return { getRUGBalance, RUGBalance, totalNFTs, fetchSuccess, error, isLoading };
};
