import { useContext } from "react";
import Navbar from "../UtilityBars/Navbar";
import Sidebar from "../UtilityBars/Sidebar";
import OptionbarB from "../UtilityBars/OptionbarB";
import userContext from "../../Contexts/userContext";
import { FcIdea } from "react-icons/fc";
import { MdNavigateNext } from "react-icons/md";
import { useNavigate } from "react-router-dom";


function ResBody() {
  const navigate = useNavigate();
  const { reqData, setReqData } = useContext(userContext)!;
  return (
    <>
    <Navbar />
    <div className="flex">
      <Sidebar />
      <div className="grow mt-14">
        <h2 className="flex gap-1 items-center px-6 md:px-10 lg:px-14 text-xl text-neutral-700 font-bold"><FcIdea/> Create a Respondent Group</h2>
        <OptionbarB />
        <div className="flex justify-between items-center px-6 md:px-10 lg:px-14 text-sm">
          <p>Add a Title</p>
          <button className="flex gap-1 items-center px-3 lg:px-4 py-2 text-white bg-blue-600 hover:cursor-pointer hover:bg-blue-700 active:bg-blue-800 hover:shadow-xl rounded-md" onClick={()=>{navigate("/request/description")}}>Next <MdNavigateNext size={18}/></button>
        </div>
        <div className="mt-8 mx-6 md:mx-10 lg:mx-14">
          <input name="title" value={reqData.title} onChange={(e)=>setReqData(prev => ({...prev, title:e.target.value}))} className="w-full px-3 py-2 bg-gray-200 text-sm placeholder:text-sm focus:outline-none" type="text" placeholder="The title can be used to search for this group..."></input>
        </div>
      </div>
    </div>
    </>
  )
}

export default ResBody