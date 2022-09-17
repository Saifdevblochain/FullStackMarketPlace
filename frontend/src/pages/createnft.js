import { useState,useRef } from 'react'
import { ethers ,Contract} from 'ethers'
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
// import { create as ipfsHttpClient } from 'ipfs-http-client'
import "bootstrap/dist/css/bootstrap.css";
import Web3Modal from 'web3modal'
import { DEPLOYED_CONTRACT_ADDRESS as DeployedAddress, abi } from "./constant"
import { useNavigate } from "react-router-dom"

import axios from 'axios';



function Mint() {
const REACT_APP_PINATA_API_KEY = "be149a497996f034bad0"
const REACT_APP_PINATA_API_SECRET = "42db80c24946f410055ff0ad197c63608195c59ee74d26f0171f3ed68bd49edf"
const history = useNavigate()

const [fileImg, setFileImg] = useState(null);
const [imageurl,setImage] =useState(null)
const [Name, setName] = useState("")
const [desc, setDesc] = useState("")
const [_price, setPrice] = useState("")
const tokenURI = useRef("");
 
const sendJSONtoIPFS = async (ImgHash) => {
 
try {

const resJSON = await axios({
    method: "post",
    url: "https://api.pinata.cloud/pinning/pinJsonToIPFS",
    data: {
        "name": Name,
        "price":_price,
        "description": desc,
        "image": ImgHash
    },
    headers: {
        'pinata_api_key': REACT_APP_PINATA_API_KEY,
        'pinata_secret_api_key': REACT_APP_PINATA_API_SECRET,
    },
});
 
 
const res = `https://gateway.pinata.cloud/ipfs//${resJSON.data.IpfsHash}`;
tokenURI.current=res



} catch (error) {
console.log("JSON to IPFS: ")
console.log(error);
}


}

const sendFileToIPFS = async () => {


if (fileImg) {
    
try {

    const formData = new FormData();
    formData.append("file", fileImg);

    const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
            'pinata_api_key': REACT_APP_PINATA_API_KEY,
            'pinata_secret_api_key': REACT_APP_PINATA_API_SECRET,
            "Content-Type": "multipart/form-data"
        },


    });
    
     let ImgHash = `https://gateway.pinata.cloud/ipfs//${resFile.data.IpfsHash}`;
     setImage(ImgHash)
    
     
        await sendJSONtoIPFS(ImgHash)


} catch (error) {
    console.log("File to IPFS: ")
    console.log(error)
}
}
}



async function listNFTForSale(e) {
e.preventDefault()

await sendFileToIPFS()
 
const web3Modal = new Web3Modal()
const connection = await web3Modal.connect()
const provider = new ethers.providers.Web3Provider(connection)
const signer = provider.getSigner()
 
/* next, create the item */
let price = ethers.utils.parseUnits(_price, 'ether')
let contract = new  Contract(DeployedAddress, abi, signer)

let listingPrice = await contract.getListingPrice()
listingPrice = listingPrice.toString()
  price =price.toString();
  
   
let transaction = await contract.createToken(tokenURI.current, price , { value: listingPrice })

await transaction.wait()

// history('/')
}
return (
<div className="App">

<p> Your Network Should be Rinkeby </p>


<form onSubmit={listNFTForSale} className='m-5'>
     
    {/* <input type="file" onChange={(e) => setFileImg(e.target.files[0])} required /> <br />  <br /> */}
   <Form.Control   className="mb-3" type="file" size="lg" onChange={(e) => setFileImg(e.target.files[0])} required/>
    <Form.Control className="mb-3" size="lg" type="text" onChange={(e) => setName(e.target.value)} placeholder='Name' required value={Name} />
    {/* <input type="text" onChange={(e) => setName(e.target.value)} placeholder='Name' required value={Name} />  <br /> <br /> */}
    <Form.Control className="mb-3" size="lg" type="text" onChange={(e) => setDesc(e.target.value)} placeholder="Description" required value={desc} />

    <Form.Control className="mb-3" size="lg" type="text" onChange={(e) => setPrice(e.target.value)} placeholder="Price" required value={_price} />

   

    {/* <input type="text" onChange={(e) => setDesc(e.target.value)} placeholder="Description" required value={desc} /> */}
    {/* <input type="number" onChange={(e) => setPrice(e.target.value)} placeholder="Price" required value={_price} /> */}
    
    <Button type='submit' variant="primary">Create NFT</Button>

</form>

 {
    imageurl!==null?
    <>
    <img src={imageurl} alt='' width='300px' height='200px'></img>
    </> : "File will show here"
 }




</div>
);
}

export default Mint;
