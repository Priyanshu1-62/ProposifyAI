import { useState, useContext, useEffect } from "react";
import Navbar from "../UtilityBars/Navbar";
import Sidebar from "../UtilityBars/Sidebar";
// import OptionbarA from "../UtilityBars/OptionbarA";
// import userContext from "../../Contexts/userContext";
// import { FcMindMap } from "react-icons/fc";
import { MdNavigateNext } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
import Alerts from "../Alert/Alerts";
import RequestItem from "./RequestItem";
import type { request } from "../../Models/request";
import alertContext from "../../Contexts/alertContext";
import { getRequests } from "../../services/requestService/getRequests";
import { useNavigate } from "react-router-dom";


function Requests() {
  const navigate = useNavigate();
  const [requestsData, setRequestsData] = useState<request[]>([]);
  const { handleApiResponse } = useContext(alertContext)!;

  const getRequestsData = async () => {
    const result = await getRequests();

    handleApiResponse(result, "Requests fetched successfully !!");

    if(result.ok){
      setRequestsData(result.data);
    }
    else if(result.status === 401){
      navigate("/");
    }
  }

  useEffect(()=>{
    getRequestsData();
  }, []);
  return (
    <>
    <Navbar />
    <Alerts />
    <div className="h-[93.4vh] flex">
      <Sidebar />
      <div className="h-[93.4vh] grow mt-14 overflow-y-auto">
        <h2 className="flex gap-1 items-center px-14 text-xl text-neutral-700 font-bold"><MdNavigateNext size={24}/> My Requests</h2>
        <div className="px-14 mt-10 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
          {requestsData.map((element: request) => {
            return <RequestItem key={element.id} element={element}/>
          })}
        </div>
      </div>
    </div>
    </>
  )
}

export default Requests