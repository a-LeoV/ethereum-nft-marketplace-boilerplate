import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useEffect, useState } from "react";
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";
import { useIPFS } from "./useIPFS";
import { getCollectionsByChain } from "helpers/collections";
import SearchCollections from "components/SearchCollections";

export const useGraveBalance = (addr) => {
  const { account } = useMoralisWeb3Api();
  const { chainId } = useMoralisDapp();
  const { resolveLink } = useIPFS();
  const [GraveBalance, setGraveBalance] = useState([]);
  const [totalGraveNFTs, setTotalGraveNFTs] = useState();
   
    
     
  const {
    fetch: getGraveBalance,
    data,
    error,
    isLoading,
  } = useMoralisWeb3ApiCall(account.getNFTsForContract, { chain: chainId, token_address: addr });
  const [fetchSuccess, setFetchSuccess] = useState(true);

  useEffect(() => {
    (async function() {
    if (data?.result) {
      
      const NFTs = data.result;
      setFetchSuccess(true);
      setTotalGraveNFTs(data.total);
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
      setGraveBalance(NFTs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })()}, [data]);

  return { getGraveBalance, GraveBalance, totalGraveNFTs, fetchSuccess, error, isLoading };
};
