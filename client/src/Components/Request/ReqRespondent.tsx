import { useState, useContext, useEffect } from "react";
import Navbar from "../UtilityBars/Navbar";
import Sidebar from "../UtilityBars/Sidebar";
import RequestOptionbar from "../UtilityBars/RequestOptionbar";
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
      <div className="h-[93.4vh] grow flex flex-col pt-14 pb-4">
        <h2 className="flex gap-1 px-6 md:px-10 lg:px-14 items-center text-xl text-neutral-700 font-bold"><FcIdea/> Create a Request</h2>
        <RequestOptionbar />
        <div className="flex justify-between items-center px-6 md:px-10 lg:px-14 text-sm">
          <p>Select Group</p>
          <button className="flex gap-1 items-center px-4 py-2 text-white bg-teal-600 hover:cursor-pointer hover:bg-teal-700 active:bg-teal-800 hover:shadow-xl rounded-md" onClick={handleSubmit}>Send Requests <MdOutgoingMail size={18}/></button>
        </div>
        {!!groupsData.length && <div className="grow overflow-y-auto">
          <div className="px-6 md:px-10 lg:px-14 mt-10 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
            {groupsData.map((element: resGroup) => {
              return <ResGroupSelectItem key={element.id} element={element} handleSelect={(id) => {setReqData(prev => ({...prev, respondentGroupId: id}))}}/>
            })}
          </div>
        </div>}
        {!groupsData.length && <div className="w-full grow flex justify-center items-center text-sm">
          <div className="flex">
            <p>No Groups found, &nbsp;</p>
            <button className="text-blue-500 underline underline-offset-2 hover:cursor-pointer hover:text-blue-900" onClick={()=>{navigate("/respondentGroup/create")}}>create one.</button>
          </div>
        </div>}      
      </div>
    </div>
    </>
  )
}

export default ReqRespondent