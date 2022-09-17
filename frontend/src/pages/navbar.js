import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function ColorSchemesExample() {
  return (
    <>
      
      <Navbar bg="primary" variant="dark">
        <Container>
          
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/createnft">Create NFT</Nav.Link>
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/my-nfts">Mt Nfts</Nav.Link>
            {/* <Nav.Link as={Link} to="/resell-nft">Re-sell Nft </Nav.Link> */}
            {/* <Nav.Link as={Link} to="">{<h1>Signer</h1>} </Nav.Link> */}
          </Nav>
        </Container>
      </Navbar>
 
    </>
  );
}

export default ColorSchemesExample;