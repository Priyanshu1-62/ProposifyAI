import { useState, useContext } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Optionbar from "./Optionbar";
import userContext from "../Contexts/userContext";
import { FcMindMap } from "react-icons/fc";
import { MdNavigateNext } from "react-icons/md";
import { useNavigate } from "react-router-dom";


function Requests() {
  const navigate = useNavigate();
  const { reqData, setReqData } = useContext(userContext)!;
  return (
    <>
    <Navbar />
    <div className="flex">
      <Sidebar />
      <div className="grow mt-14">
        <h2 className="flex gap-1 items-center px-14 text-xl text-neutral-700 font-bold"><FcMindMap/> Requests</h2>
        <Optionbar />
        <div className="flex justify-between items-center px-16 text-sm">
          <p>Add a Title</p>
          <button className="flex gap-1 items-center px-4 py-2 text-white bg-blue-600 hover:cursor-pointer hover:bg-blue-700 active:bg-blue-800 hover:shadow-xl rounded-md" onClick={()=>{navigate("/request/description")}}>Next <MdNavigateNext size={18}/></button>
        </div>
        <div className="mt-8 mx-16">
          <input name="title" value={reqData.title} onChange={(e)=>setReqData(prev => ({...prev, title:e.target.value}))} className="w-full px-3 py-2 bg-gray-200 text-sm placeholder:text-sm focus:outline-none" type="text" placeholder="The title can be used to search for this request..."></input>
        </div>
      </div>
    </div>
    </>
  )
}

export default Requests