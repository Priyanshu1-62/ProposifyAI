import { useState, useContext } from "react";
import Navbar from "../UtilityBars/Navbar";
import Sidebar from "../UtilityBars/Sidebar";
import userContext from "../../Contexts/userContext";
import { useNavigate } from "react-router-dom";
import { MdNavigateNext } from "react-icons/md";
import respondentContext from "../../Contexts/respondentContext";
import Alerts from "../Alert/Alerts";


function ResGroupCreate() {
  const navigate = useNavigate();
  const { resGroupName, setResGroupName } = useContext(userContext)!;
  const { createRespondentGroup } = useContext(respondentContext)!;

  const handleCreate = async () => {
    const result = await createRespondentGroup(resGroupName);
    if(result.ok){
      setResGroupName("");
      console.log(result);
      navigate(`/respondentGroup/update/${result.data.group.id}`);
    }
  }
  return (
    <>
    <Navbar />
    <Alerts />
    <div className="flex">
      <Sidebar />
      <div className="grow flex justify-center items-center bg-gray-100">
        <div className="flex flex-col gap-6 w-1/2 px-16 py-6 text-sm font-bold text-neutral-600 bg-white border-t-2 border-l-2 border-gray-500">
          <p>Group Name</p>
          <input name="title" value={resGroupName} onChange={(e)=>setResGroupName(e.target.value)} className="grow px-3 py-2 bg-gray-200 rounded-md placeholder:text-sm focus:outline-none truncate" type="text" placeholder="The name can be used to search for this group..."></input>
          <div className="flex justify-end">
            <button className="flex gap-1 items-center px-4 py-2 text-white bg-blue-600 hover:cursor-pointer hover:bg-blue-700 active:bg-blue-800 hover:shadow-xl rounded-md" onClick={handleCreate}>Create <MdNavigateNext size={18}/></button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default ResGroupCreate