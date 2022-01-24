import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useWeb3ExecuteFunction } from "react-moralis";
import { Card, Button, InputNumber, Typography } from "antd";
import React, { useState } from "react";
import { FireOutlined, CheckOutlined, WalletOutlined } from "@ant-design/icons";
const { Text } = Typography;


const styles = {
  title: {
    fontSize: "16px",
    fontWeight: "700", 
    textAlign: "center",
    flex: "1",
  },
  text: {
    fontSize: "16px",
  },
  card: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "40px",
    width: "400px",
    height: "250px",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  card2: {
    boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
    border: "1px solid #e7eaf3",
    borderRadius: "40px",
    width: "800px",
    height: "300px",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  buttons: {
    background: "blue",
    color: "white",
    shape: "round",
    padding: "10px",
    border: "none",
    display: "flex",
    flex: "1",
    width: "350px",
    height: "130px",
    justifyContent: 'center',
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    boxShadow: "0px 2px 2px lightgray",
    borderRadius: "40px",
    fontSize: "40px",
    fontWeight: "700",
  },
  buttons2: {
    background: "blue",
    color: "white",
    shape: "round",
    padding: "10px",
    border: "none",
    display: "flex",
    flex: "1",
    width: "750px",
    height: "130px",
    justifyContent: 'center',
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    boxShadow: "0px 2px 2px lightgray",
    borderRadius: "40px",
    fontSize: "40px",
    fontWeight: "700",
  },
};

function Burn () {
  
    const { chainId, crContractABI, crAddress, mrAddress, mrContractABI, walletAddress } = useMoralisDapp();
    const contractProcessor = useWeb3ExecuteFunction();
    const crContractABIJson = JSON.parse(crContractABI);
    const mrContractABIJson = JSON.parse(mrContractABI);
    const setApprovalForAllFunction = "setApprovalForAll";
    const burn2mint_ALL_RUGSFunction = "burn2mint_ALL_RUGS";
    const mintFunction = "mint";
    const [amountToMint, setAmount] = useState(null);
    const pricePerMR = "50000000000000";
    

     async function setApprovalForAll(){
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
                alert("Burn 2 Mint is approved")
            },
            onError: (error) => {
              alert(JSON.stringify(error))
            },
        })
      }
    
    async function burn2mint_ALL_RUGS(){
      const ops = {
          contractAddress: mrAddress,
          functionName: burn2mint_ALL_RUGSFunction,
          abi: mrContractABIJson,
          params : {
            owner: walletAddress,
          }
      };
  
      await contractProcessor.fetch({
          params: ops,
          onSuccess: () => {
              alert("All your CryptoRugs were burned successfully - MetaRugs minted")
          },
          onError: (error) => {
              alert(JSON.stringify(error))
          },
      })
    }

      async function mintArug(amount) {
        const p = String(amount * pricePerMR);
        const ops = {
            contractAddress: mrAddress,
            functionName: mintFunction,
            abi: mrContractABIJson,
            params : {
              numberOfTokens: amount,
            },
            msgValue: String(p),
        };
    
        await contractProcessor.fetch({
            params: ops,
            onSuccess: () => {
                alert("MetaRugs minted")
            },
            onError: (error) => {
              alert(JSON.stringify(error))
            }
        })
      }

      function onChange(value) {
        setAmount(value);
      }

    return (
    <div style={{ display: "flex", gap: "10px", maxWidth: "820px", flexWrap: "wrap" }}>
      <Card style={styles.card} title={<h1 style={styles.title}>📝 Approve Meta Rugs contract</h1>}>
      <Button style={styles.buttons} icon={<CheckOutlined />} 
        onClick={() => setApprovalForAll()}
        > Approve</Button>
      </Card>
      
      <div>
        <Card style={styles.card} title={<h1 style={styles.title}>🔥 Burn all your Crypto Rugs & mint Meta Rugs</h1>}>
        <Button style={styles.buttons} icon={<FireOutlined />} 
        onClick={() => burn2mint_ALL_RUGS()}
        > Burn</Button>
        </Card>
     
   
        </div>
   <div>     <Card style={styles.card2} title={<h1 style={styles.title}>🌿 Mint MetaRugs for 0.05 ETH each</h1>}>
     <div style={{ display: 'flex', justifyContent: 'center', alignItems: "center", gap: "20px", padding: "10px"}} >
       
     <InputNumber autoFocus={true} defaultValue={"0"} min={"1"} max={"30"} onChange={onChange} />
     {<h1 style={styles.text}> Max 30 MetaRugs for transaction</h1>}
     </div> 
    
        <Button style={styles.buttons2} icon={<WalletOutlined />} 
        onClick={() => mintArug(amountToMint)}
        > Mint</Button>
        </Card>
        </div>

      </div>
    
  )

};

export default Burn;

 