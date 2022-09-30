import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { DEPLOYED_CONTRACT_ADDRESS as DeployedAddress, abi } from "./constant"
import { useNavigate } from 'react-router-dom'
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default function MyAssets() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const history = useNavigate()
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "rinkeby",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketplaceContract = new ethers.Contract(DeployedAddress, abi, signer)
    const data = await marketplaceContract.fetchMyNFTs()
    console.log(data)

    const items = await Promise.all(data.map(async i => {
      const tokenURI = await marketplaceContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenURI)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        tokenURI
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded')
  }
  function listNFT(nft) {
    console.log('nft:', nft.tokenURI)
    console.log('nft:', nft.tokenId)
    history(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`)
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No NFTs owned</h1>)
  return (

    <Row xs={1} md={3} className="m-3 g-4">
      {nfts.map((nft, i) => (
        <Col key={i} >
          <Card style={{ height: '30rem' }}>
            < div  >
              {/* <Image src={nft.image} className="img-thumbnail" alt="" /> */}
              <Card.Img variant="top" src={nft.image} style={{ height: '18rem' }} />
              <Card.Body>
                <Card.Text> {nft.price} ETH</Card.Text>

                <Button size="lg" variant="primary" onClick={() => listNFT(nft)}>List
                </Button>
              </Card.Body>

            </div>
          </Card>
        </Col>
      ))}
    </Row>
  )
}