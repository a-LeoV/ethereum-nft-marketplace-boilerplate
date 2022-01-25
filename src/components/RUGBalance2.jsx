import React, { useState } from "react";
import { useMoralis } from "react-moralis";
import { Card, Image, Tooltip, Modal, Input, Alert, Spin, Button, InputNumber, PageHeader } from "antd";
import { useRUGBalance2 } from "hooks/useRUGBalance2";
import { FileSearchOutlined, ArrowRightOutlined, FireOutlined, CheckOutlined, WalletOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { getExplorer } from "helpers/networks";
import { useWeb3ExecuteFunction } from "react-moralis";
import Text from "antd/lib/typography/Text";
import { Link } from "react-router-dom";
import Burn from "components/Burn";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink,
    Redirect,
  } from "react-router-dom";
const { Meta } = Card;

const styles = {
  NFTs: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "start",
    justifyContent: "flex-start",
    margin: "0 auto",
    maxWidth: "1000px",
    gap: "10px",
  },

  title: {
    fontSize: "20px",
    fontWeight: "700", 
    textAlign: "center",
    flex: "1",
    textWrap: "wrap"
  },

  alertsHeader: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "center",
    fontFamily: "Roboto, sans-serif",
    
    gap: "10px",
    fontSize: "18.3px", 
    fontWeight: "600", 
    justifyContent: 'center', 
    alignItems: "center", 
    gap: "20px", 
    padding: "10px", 
    alignSelf: "center",
    float: "none",
    whiteSpace: "nowrap",
  },

  alerts: {
    display: "flex",
    
    flexWrap: "wrap",
    flexDirection: "row",
    WebkitBoxPack: "center",
    gap: "10px",
    fontSize: "18.3px", 
    fontWeight: "600", 
    alignItems: "center", 
    gap: "10px", 
    
    flexGrow: "1",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    float: "none",
    alignSelf: "center",
    padding: "10px", 
 
  },

  navLink: {
    display: "flex",
    flexWrap: "wrap",
    fontSize: "28px", 
    fontWeight: "600",
    justifyContent: 'center', 
    flexDirection: "row-reverse",
    alignItems: "center",
    WebkitBoxPack: "start",
    margin: "0 auto",
    height: "55px"


  },

  break: {
    flexBasis: "100%",
    height: "0",
  },

  card: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "40px",
    width: "900px",
    height: "160px",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  card2: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "40px",
    width: "900px",
    height: "60px",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },

};


function RUGBalance() {
  const { RUGBalance, totalNFTs, fetchSuccess } = useRUGBalance2();
  const { chainId, marketAddress, contractABI, crContractABI, crAddress, mrAddress, mrContractABI } = useMoralisDapp();
  const { Moralis } = useMoralis();
  const [visible, setVisibility] = useState(false);
  const [nftToBurn, setnftToBurn] = useState(null);
  const [price, setPrice] = useState(1);
  const [loading, setLoading] = useState(false);
  const contractProcessor = useWeb3ExecuteFunction();
  const contractABIJson = JSON.parse(contractABI);
  const listItemFunction = "createMarketItem";
  const ItemImage = Moralis.Object.extend("ItemImages");
  const setApprovalForAllFunction = "setApprovalForAll";
  const burn2mint_ONE_RUGFunction = "burn2mint_ONE_RUG"
  const [approve, setapproval] = useState(null);
  const crContractABIJson = JSON.parse(crContractABI);
  const mrContractABIJson = JSON.parse(mrContractABI);
  
  

  async function setApprovalForAll(){
    setLoading(true); 
    const ops = {
        contractAddress: crAddress,
        functionName: setApprovalForAllFunction,
        abi: crContractABIJson,
      params : {
          operator: mrAddress,
          approved: true,
      }
    };
    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        console.log("Approval Received");
        setLoading(false);
        succApprove();
      },
      onError: (error) => {
          setLoading(false);
          failApprove();
      }
  })
}

async function burn2mint_ONE_RUG(nft) {
    setLoading(true);
    const ops = {
        contractAddress: mrAddress,
        functionName: burn2mint_ONE_RUGFunction,
        abi: mrContractABIJson,
        params : {
            tokenId: nft.token_id,
        }
    };

    await contractProcessor.fetch({
        params: ops,
        onSuccess: () => {
            console.log("CryptoRug burned successfully - MetaRug minted");
            setLoading(false);
            setVisibility(false);
            addItemImage();
            succBurn();
          },
          onError: (error) => {
            setLoading(false);
            failBurn();
          },
    })
  }

  const handleBurn2Mint_ONE_RUG = (nft) => {
    setnftToBurn(nft);
    setVisibility(true);
  };

  const handlesetApprovalForAll = (approve) => {
    setapproval(approve);
    setVisibility(true);
  };


  async function approveAll(nft) {
    setLoading(true);  
    const ops = {
      contractAddress: nft.token_address,
      functionName: "setApprovalForAll",
      abi: [{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"}],
      params: {
        operator: marketAddress,
        approved: true
      },
    };

    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        console.log("Approval Received");
        setLoading(false);
        setVisibility(false);
        succApprove();
      },
      onError: (error) => {
        setLoading(false);
        failApprove();
      },
    });
  }

  async function list(nft, listPrice) {
    setLoading(true);
    const p = listPrice * ("1e" + 18);
    const ops = {
      contractAddress: marketAddress,
      functionName: listItemFunction,
      abi: contractABIJson,
      params: {
        nftContract: nft.token_address,
        tokenId: nft.token_id,
        price: String(p),
      },
    };

    await contractProcessor.fetch({
      params: ops,
      onSuccess: () => {
        console.log("CryptoRug burned successfully - MetaRug minted");
        setLoading(false);
        setVisibility(false);
        addItemImage();
        succBurn();
      },
      onError: (error) => {
        setLoading(false);
        failBurn();
      },
    });
  }

  const handleSellClick = (nft) => {
    setnftToBurn(nft);
    setVisibility(true);
  };

  function succBurn() {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "Success!",
      content: `CryptoRug burned successfully - MetaRug minted`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function succApprove() {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "Success!",
      content: `Approval is now set, you may burn your RUG`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function failBurn() {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Error!",
      content: `There was a problem listing your NFT`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function failApprove() {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Error!",
      content: `There was a problem with setting approval`,
    });
    setTimeout(() => {
      modal.destroy();
    }, secondsToGo * 1000);
  }

  function addItemImage() {
    const itemImage = new ItemImage();

    itemImage.set("image", nftToBurn.image);
    itemImage.set("nftContract", nftToBurn.token_address);
    itemImage.set("tokenId", nftToBurn.token_id);
    itemImage.set("name", nftToBurn.name);
    itemImage.save();
  }

  return (
    <> 

        <div>     
            <Card style={styles.card2} title={<h1 style={styles.title}> {"Congratulations, you've been provably rugged " + totalNFTs + " times"} </h1>}>
            </Card>
         
        <div >
        <Card style={styles.card} title={<h1 style={styles.title}> {"You can mint a MetaRug for each CryptoRug you burn. You can also burn all your rugs at once!"} </h1>}  >
        <div> <NavLink className="center-block" style={styles.navLink}   to="/burn">🔥 Burn All & Mint MetaRugs</NavLink>  </div>
            </Card>
   
        <div>
        <Card style={styles.card} title={<h1 style={styles.title}> {"If you don't have CryptoRugs you can find more at Opensea"} </h1>}>
        <div> <Button style={styles.navLink} onClick={()=> window.open("https://opensea.io/collection/thecryptorugs", "_blank" )}>CryptoRugs on OpenSea</Button> </div>
        
            </Card>
        
        </div>
        </div>


   


    
   


      <div style={styles.NFTs}> 
          <> 
        
            
          </> 
         
        {!fetchSuccess && (
          <>
            <Alert 
              message="Unable to fetch all NFT metadata... We are searching for a solution, please try again later!"
              type="warning"
            />
            <div style={{ marginBottom: "10px" }}></div>
          </>
        )}
        {RUGBalance &&
          RUGBalance.map((nft, index) => (
            <Card
              hoverable onClick={() => handleBurn2Mint_ONE_RUG(nft)}
              actions={[ 
                <Tooltip title="View On Blockexplorer">
                  <FileSearchOutlined
                    onClick={() =>
                      window.open(
                        `${getExplorer(chainId)}token/${nft.token_address}?a=${nft.token_id}`,
                        "_blank"
                      )
                    }
                  />
                     </Tooltip>,
                <Tooltip title="Burn 2 Mint">
                  <FireOutlined onClick={() => handleBurn2Mint_ONE_RUG(nft)} />
                </Tooltip>,
              ]}
              style={{ width: 300, border: "2px solid #e7eaf3" }}
              cover={
                <Image
                  preview={false}
                  src={nft?.image || "error"}
                  fallback="data:image/png;base64,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"
                  alt=""
                  style={{ height: "400px" }}
                />
              }
              key={index}
            >
              <Meta title={nft.name + " #" + nft.token_id} description={nft.token_address}  />
            </Card>
          ))}
      </div>

      <Modal
        title={`Burn ${nftToBurn?.name + " #" + nftToBurn?.token_id || "NFT"}`}
        visible={visible}
        onCancel={() => setVisibility(false)}
        onOk={() => burn2mint_ONE_RUG(nftToBurn)}
        okText="Burn"
        footer={[
          <Button onClick={() => setVisibility(false)}>
            Cancel
          </Button>,
          <Button onClick={() => setApprovalForAll()} type="primary">
            Approve
          </Button>,
          <Button onClick={() => burn2mint_ONE_RUG(nftToBurn)} type="primary">
            Burn
          </Button>
        ]}
      >
        <Spin spinning={loading}>
          <img
            src={`${nftToBurn?.image}`}
            style={{
              width: "250px",
              margin: "auto",
              borderRadius: "10px",
              marginBottom: "15px",
            }}
          />
          <Input
            autoFocus
            placeholder="Listing Price in MATIC"
            onChange={(e) => setPrice(e.target.value)}
          />
        </Spin>
      </Modal>
      </div>
    </>
  );
}

export default RUGBalance;
