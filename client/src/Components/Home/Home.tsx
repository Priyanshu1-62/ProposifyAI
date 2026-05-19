import { useNavigate } from "react-router-dom";
import Navbar from "../UtilityBars/Navbar";
import Sidebar from "../UtilityBars/Sidebar";
import { useEffect } from "react";

function Home() {
  const navigate = useNavigate();
  useEffect(()=>{
    
  }, []);
  return (
    <>
    <Navbar />
    <div className="h-[93.4vh] flex">
      <Sidebar/>
      <div className="grow w-full h-full flex flex-col items-center overflow-auto px-7 md:px-16 lg:px-28">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-blue-100 font-bold mt-12 md:mt-20 l:mt-28 mb-6">Create Your Request</h1>
          <p className="md:text-lg text-gray-400 text-center mb-12">Transform your ideas into professional proposal workflow with the power of AI.
          Get started in seconds.</p>
        </div>
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
        <button className="px-6 py-3 text-white rounded-lg bg-linear-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 hover:cursor-pointer transition-all ease-in-out duration-200 delay-100" onClick={()=>{navigate("/request/title")}}>Get Started</button>
      </div>
    </div>
    </>
  )
}

export default Home