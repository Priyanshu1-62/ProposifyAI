import { useState, useContext, useEffect } from "react";
import Navbar from "../UtilityBars/Navbar";
import Sidebar from "../UtilityBars/Sidebar";
// import userContext from "../../Contexts/userContext";
import { FcParallelTasks } from "react-icons/fc";
// import { FaRegAddressCard } from "react-icons/fa";
// import { MdNavigateNext } from "react-icons/md";
// import { MdDownloadDone } from "react-icons/md";
// import { RxCross2 } from "react-icons/rx";
// import { useNavigate } from "react-router-dom";
// import ResItem from "./ResItem";
// import type { respondent } from "../../Models/respondent";
import ResGroupItem from "./ResGroupItem";
import type { resGroup } from "../../Models/resGroup";
import { getRespondentGroups } from "../../services/respondentService/getRespondentGroups";
import alertContext from "../../Contexts/alertContext";
import { useNavigate } from "react-router-dom";


function ResGroups() {
  const navigate = useNavigate();
  const [groupsData, setGroupsData] = useState<resGroup[]>([]);
  const { handleApiResponse } = useContext(alertContext)!;

  const getGroups = async () => {
    const result = await getRespondentGroups();

    handleApiResponse(result, "Groups fetched successfully !!");

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
    <div className="h-[93.4vh] flex">
      <Sidebar />
      <div className="grow mt-14 overflow-y-auto">
        <h2 className="flex gap-1 items-center px-14 text-xl text-neutral-700 font-bold"><FcParallelTasks size={24}/> Respondent Groups</h2>
        <div className="px-14 mt-10 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
          {groupsData.map((element: resGroup) => {
            return <ResGroupItem key={element.id} element={element}/>
          })}
        </div>
      </div>
    </div>
    </>
  )
}

export default ResGroups