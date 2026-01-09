import { useContext } from "react";
import Navbar from "../UtilityBars/Navbar";
import Sidebar from "../UtilityBars/Sidebar";
import { MdNavigateNext } from "react-icons/md";
import userContext from "../../Contexts/userContext";
import { FcIdea } from "react-icons/fc";
import OptionbarA from "../UtilityBars/OptionbarA";
import { useNavigate } from "react-router-dom";

function ReqDescription() {
  const navigate = useNavigate();
  const { reqData, setReqData } = useContext(userContext)!;
  return (
    <>
    <Navbar />
    <div className="flex">
      <Sidebar />
      <div className="grow mt-14 mb-4">
        <h2 className="flex gap-1 px-14 items-center text-xl text-neutral-700 font-bold"><FcIdea/> Create a Request</h2>
        <OptionbarA />
        <div className="flex justify-between items-center px-16 text-sm">
          <p>Add a Description</p>
          <button className="flex gap-1 items-center px-4 py-2 text-white bg-blue-600 hover:cursor-pointer hover:bg-blue-700 active:bg-blue-800 hover:shadow-xl rounded-md" onClick={()=>{navigate("/request/respondent")}}>Next <MdNavigateNext size={18}/></button>
        </div>
        <div className="mt-8 px-16">
          <textarea name="description" value={reqData.description} onChange={(e)=>setReqData(prev => ({...prev, description:e.target.value}))} className="w-full min-h-64 px-3 py-2 bg-gray-200 text-sm placeholder:text-sm focus:outline-none" placeholder="Specify features, quantity, budget, deadlines, and more details if any..."></textarea>
        </div>
      </div>
    </div>
    </>
  )
}

export default ReqDescription