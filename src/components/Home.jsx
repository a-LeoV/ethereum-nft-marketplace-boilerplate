import { Card, Button } from "antd";
import Image from "rc-image";
import metagif from "./images/MetaRugs_-_Logo V3.gif"
import { useRUGBalance2 } from "hooks/useRUGBalance2";



const styles = {
  title: {
    fontSize: "24px",
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
    width: "800px",
    height: "800px",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    display: "flex",
    color: "rgb(248, 251, 247)"
  },
  buttons: {
    background: "red",
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
    
  }
};

export default function Home({ isServerInfo }) {
    const { totalNFTs } = useRUGBalance2();
 
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: "center"}}>
      <Card style={styles.card} title={<h1 style={styles.title}>👋 Welcome rugged fellas</h1>}>
      <Button style={styles.buttons}> {"You have " + totalNFTs + " dirty Crypto Rugs"}</Button>
     <div style={{ display: 'flex', justifyContent: 'center', alignItems: "center"}} >
      <Image src={metagif} width={540} height={540} />
      </div>
      </Card>
    </div>
  );
}
