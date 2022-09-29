import {Routes,Route} from 'react-router-dom'
import './App.css';
import TypesExample from './pages/navbar';
import CreatorDashboard from './pages/dashboard';
import Mint from './pages/createnft';
import MyAssets from './pages/my-nfts'
import Home from './pages/index'
import ResellNFT from './pages/resell-nft'
 
  
function App() {
   
   return (
    <div className="App">

      <TypesExample />
      
      {/* <Mint /> */}
      <Routes>
      
      <Route path="/" element={<Home />} > </Route>
      <Route path="/createnft" element={<Mint />} > </Route>
      <Route path="/dashboard" element={<CreatorDashboard />} > </Route>
      <Route path="/my-nfts" element={<MyAssets />} > </Route>
      <Route path="/resell-nft" element={<ResellNFT />} > </Route>

      </Routes>
      
    </div>
  );
}

export default App;
