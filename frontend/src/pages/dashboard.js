import { ethers, Contract, providers } from "ethers";
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { DEPLOYED_CONTRACT_ADDRESS as DeployedAddress, abi } from "./constant"
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
export default function CreatorDashboard() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()

  }, [])

  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: 'rinkeby',
      cacheProvider: true,
      providerOptions: {}
    })
    const connection = await web3Modal.connect()
    const provider = new providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const contract = new Contract(DeployedAddress, abi, signer)
    const data = await contract.fetchItemsListed()
    console.log(data)
    // let y= data[0][3];
    //     data.map((i)=>{
    //       console.log("Item is;",i)
    //       return i;
    //     })
    // console.log(y.toString())

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await contract.tokenURI(i.tokenId)
      console.log(tokenUri)
      const meta = await axios.get(tokenUri)
      console.log(meta)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,

      }
      // console.log(i.tokenId)
      console.log(i)
      console.log(item)
      return item


    }))
    console.log(items, "items")
    setNfts(items)
    setLoadingState('loaded')
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No NFTs listed</h1>)
  return (
    <Row xs={1} md={3} className="m-3 g-4">
      {nfts.map((nft, i) => (
        <Col key={i} >
          <Card style={{ height: '22rem' }}>
            < div  >
              {/* <Image src={nft.image} className="img-thumbnail" alt="" /> */}
              <Card.Img variant="top" src={nft.image} style={{ height: '18rem' }} />
              <Card.Body>



                <Card.Text> {nft.price} ETH</Card.Text>


              </Card.Body>

            </div>
          </Card>
        </Col>
      ))}
    </Row>
  )
}