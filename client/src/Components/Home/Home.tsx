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
    <div className="flex">
      <Sidebar/>
      <div className="grow flex justify-center items-center">
        <div className="flex">
          <p>Create a new &nbsp;</p>
          <button className="text-blue-600 underline underline-offset-2 hover:text-blue-700 hover:cursor-pointer" onClick={()=>{navigate("/request/title")}}>Request</button>
        </div>
      </div>
    </div>
    </>
  )
}

export default Home