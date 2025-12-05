import { useState, useContext } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Optionbar from "./Optionbar";
import userContext from "../Contexts/userContext";
import { FcIdea } from "react-icons/fc";
import { MdOutgoingMail } from "react-icons/md";

function ReqRespondent() {
  const { reqData, setReqData } = useContext(userContext)!;
  return (
    <>
    <Navbar />
    <div className="flex">
      <Sidebar />
      <div className="grow mt-14 mb-4">
        <h2 className="flex gap-1 px-14 items-center text-xl text-neutral-700 font-bold"><FcIdea/> Create a Request</h2>
        <Optionbar />
        <div className="flex justify-between items-center px-16 text-sm">
          <p>Add a Title</p>
          <button className="flex gap-1 items-center px-4 py-2 text-white bg-teal-600 hover:cursor-pointer hover:bg-teal-700 active:bg-teal-800 hover:shadow-xl rounded-md">Submit <MdOutgoingMail size={18}/></button>
        </div>
        <div className="mt-8 px-16">
          <input name="title" value={reqData.title} onChange={(e)=>setReqData(prev => ({...prev, title:e.target.value}))} className="w-full px-3 py-2 bg-gray-200 text-sm placeholder:text-sm focus:outline-none" type="text" placeholder="Title"></input>
        </div>
      </div>
    </div>
    </>
  )
}

export default ReqRespondent