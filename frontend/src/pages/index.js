import { ethers } from "ethers";

import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import "bootstrap/dist/css/bootstrap.css";
import { DEPLOYED_CONTRACT_ADDRESS as DeployedAddress, abi } from "./constant";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "rinkeby",
      cacheProvider: true,
      providerOptions: {},
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(DeployedAddress, abi, signer);
    const data = await contract.fetchMarketItems();
    console.log(data);

    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }
  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(DeployedAddress, abi, signer);

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price,
    });
    await transaction.wait();
    loadNFTs();
  }
  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>;
  return (
    <Row xs={1} md={3} className="m-3 g-4">
      {nfts.map((nft, i) => (
      <Col key={i} >  
    <Card  style={{ height: '30rem' }}>
        < div  >
          {/* <Image src={nft.image} className="img-thumbnail" alt="" /> */}
          <Card.Img variant="top" src={nft.image} style={{ height: '18rem' }}  />
          <Card.Body>
          <Card.Title> {nft.name}</Card.Title>

          <Card.Text>{nft.description}</Card.Text>
          <Card.Text> {nft.price} ETH</Card.Text>

          <Button size="lg" variant="primary" onClick={() => buyNft(nft)}>
            Buy
          </Button>
          </Card.Body>
          
        </div>
    </Card>
    </Col>
      ))}
    </Row>
  );
}
