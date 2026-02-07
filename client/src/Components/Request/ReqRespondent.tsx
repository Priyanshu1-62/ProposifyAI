import { useState, useContext, useEffect } from "react";
import Navbar from "../UtilityBars/Navbar";
import Sidebar from "../UtilityBars/Sidebar";
import OptionbarA from "../UtilityBars/OptionbarA";
import userContext from "../../Contexts/userContext";
import { FcIdea } from "react-icons/fc";
import { MdOutgoingMail } from "react-icons/md";
import type { resGroup } from "../../Models/resGroup";
import ResGroupSelectItem from "../Respondent/ResGroupSelectItem";
import { useNavigate } from "react-router-dom";
import Alerts from "../Alert/Alerts";
import alertContext from "../../Contexts/alertContext";
import { createRequest } from "../../services/requestService/createRequest";
import { getRespondentGroups } from "../../services/respondentService/getRespondentGroups";

function ReqRespondent() {
  const navigate = useNavigate();
  const { reqData, setReqData } = useContext(userContext)!;
  const [groupsData, setGroupsData] = useState<resGroup[]>([]);
  const { handleApiResponse } = useContext(alertContext)!;

  const handleSubmit = async () => {
    const result = await createRequest(reqData);

    handleApiResponse(result, "Result created successfully !!");

    if(result.ok){
      setReqData({title: "", description: "", respondentGroupId: ""});
      navigate('/requests');
    }
    else if(result.status === 401){
      navigate("/");
    }
  }

  const getGroups = async () => {
    const result = await getRespondentGroups();

    if(result.ok){
      setGroupsData(result.data);
    }
    else if(result.status === 401){
      navigate("/");
    }
  }
  
  useEffect(()=>{
    getGroups();
  }, []);
  return (
    <>
    <Navbar />
    <Alerts />
    <div className="flex">
      <Sidebar />
      <div className="grow mt-14 mb-4">
        <h2 className="flex gap-1 px-14 items-center text-xl text-neutral-700 font-bold"><FcIdea/> Create a Request</h2>
        <OptionbarA />
        <div className="flex justify-between items-center px-16 text-sm">
          <p>Select a Respondent Group</p>
          <button className="flex gap-1 items-center px-4 py-2 text-white bg-teal-600 hover:cursor-pointer hover:bg-teal-700 active:bg-teal-800 hover:shadow-xl rounded-md" onClick={handleSubmit}>Submit <MdOutgoingMail size={18}/></button>
        </div>
        <div className="h-[93.4vh] grow overflow-y-auto">
          <div className="px-14 mt-10 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
            {groupsData.map((element: resGroup) => {
              return <ResGroupSelectItem key={element.id} element={element} handleSelect={(id) => {setReqData(prev => ({...prev, respondentGroupId: id}))}}/>
            })}
          </div>
      </div>
      </div>
    </div>
    </>
  )
}

export default ReqRespondent