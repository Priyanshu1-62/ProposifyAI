// import { useContext } from 'react';
import Navbar from "../UtilityBars/Navbar";
import Sidebar from "../UtilityBars/Sidebar";
// import userContext from "../Contexts/userContext";

function Home() {
  return (
    <>
    <Navbar />
    <div className="flex">
      <Sidebar/>
      <div className="grow">Home</div>
    </div>
    </>
  )
}

export default Home