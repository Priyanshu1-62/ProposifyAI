// import { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "../UtilityBars/Navbar";
import Sidebar from "../UtilityBars/Sidebar";
import { useEffect } from "react";
// import userContext from "../Contexts/userContext";

function Home() {
  const navigate = useNavigate();
  useEffect(()=>{
    
  }, []);
  return (
    <>
    <Navbar />
    <div className="h-[93.4vh] flex">
      <Sidebar/>
      <div className="grow w-full h-full flex flex-col justify-center items-center py-32 overflow-auto">
        <div className="w-fit flex flex-col md:flex-row">
          <div className="flex-1">
            <img className="h-[21vh] md:w-[22vw] md:h-auto" src="./create_request.png" alt="Create Request"></img>
          </div>
          <div className="flex-1">
            <img className="h-[21vh] md:w-[22vw] md:h-auto" src="./track _invitations.png" alt="track _invitations"></img>
          </div>
          <div className="flex-1">
            <img className="h-[21vh] md:w-[22vw] md:h-auto" src="./review_responses.png" alt="review_responses"></img>
          </div>
        </div>
        <button className="px-6 py-3 text-white bg-linear-to-r from-[#3c3744] to-purple-500 rounded-lg" onClick={()=>{navigate("/request/title")}}>Create a new Request</button>
      </div>
    </div>
    </>
  )
}

export default Home