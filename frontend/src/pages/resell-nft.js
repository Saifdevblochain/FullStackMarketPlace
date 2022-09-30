import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Web3Modal from "web3modal";
import Button from "react-bootstrap/esm/Button";
import { DEPLOYED_CONTRACT_ADDRESS as DeployedAddress, abi } from "./constant";

export default function ResellNFT() {
  const [formInput, updateFormInput] = useState({ price: "", image: "" });
  const router = useSearchParams();
  console.log(router);
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  const id = params.id;
  const tokenURI = params.tokenURI;
//   const { id, tokenURI } = router;
  console.log({ id });
  console.log({ tokenURI });
  const { image, price } = formInput;

  useEffect(() => {
    fetchNFT();
  }, [id]);

  async function fetchNFT() {
    if (!tokenURI) return;
    const meta = await axios.get(tokenURI);
    updateFormInput((state) => ({ ...state, image: meta.data.image }));
  }

  async function listNFTForSale() {
    if (!price) return;
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const priceFormatted = ethers.utils.parseUnits(formInput.price, "ether");
    let contract = new ethers.Contract(DeployedAddress, abi, signer);
    let listingPrice = await contract.getListingPrice();

    listingPrice = listingPrice.toString();
    let transaction = await contract.resellToken(id, priceFormatted, {
      value: listingPrice,
    });
    await transaction.wait();

    // router('/')
  }

  return (
    <div>
      <div>
      <br></br>
        <input
          placeholder="Asset Price in Eth"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        <br></br>
        <br></br>
        
      
        {image && <img width="350" alt="" src={image} />}
        <br></br>
        <br></br>
        

        

        <Button size='lg' variant='primary' onClick={listNFTForSale}> List NFT </Button>
      </div>
    </div>
  );
}
