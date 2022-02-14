import { Select } from 'antd';
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { getCollectionsByChain } from "helpers/collections";
import {
    BrowserRouter as Router,
    Redirect,
    NavLink,
    useHistory,
  } from "react-router-dom";

function SearchCollections({setInputValue}){
    const { Option } = Select;
    const { chainId } = useMoralisDapp();
    const NFTCollections = getCollectionsByChain(chainId);
    const history = useHistory();
    const handleClick = () =>  history.push("/Graveyard");
    

    function onChange(value) {
        setInputValue(value);
    }

    return (
        <>
        <Select
            showSearch
            style={{width: "600px",
                    marginLeft: "20px" }}
            placeholder="Search whitelisted collections"
            optionFilterProp="children"
            onChange={onChange}
            onClick={handleClick}
            
        >   
        {NFTCollections && 
            NFTCollections.map((collection, i) => 
            <Option value={collection.addrs} key= {i}>{collection.name}</Option>
            )
            }   
        </Select>
            
        </>
    )
}
export default SearchCollections;