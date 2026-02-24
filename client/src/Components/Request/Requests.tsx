import { useState, useContext, useEffect } from "react";
import Navbar from "../UtilityBars/Navbar";
import Sidebar from "../UtilityBars/Sidebar";
import Alerts from "../Alert/Alerts";
import RequestOverviewItem from "./RequestIOverviewtem";
import type { requestOverviewBody } from "../../Models/requestOverviewBody";
import alertContext from "../../Contexts/alertContext";
import { useNavigate } from "react-router-dom";
import { getRequestOverviews } from "../../services/requestService/getRequestOverviews";
import { FaClipboardList } from "react-icons/fa";

function Requests() {
  const navigate = useNavigate();
  const [requestsData, setRequestsData] = useState<requestOverviewBody[]>([]);
  const { handleApiResponse } = useContext(alertContext)!;

  const getRequestsData = async () => {
    const result = await getRequestOverviews();

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
    <div className="">
      <Sidebar />
      <div className="h-[93.4vh] flex flex-col pt-14 overflow-y-auto">
        <h2 className="flex gap-1 items-center px-14 text-xl text-neutral-700 font-bold"><FaClipboardList className="text-cyan-800" size={24}/> My Requests</h2>
        {!!requestsData.length && <div className="px-14 mt-10 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
          {requestsData.map((element) => {
            return <RequestOverviewItem key={element.id} element={element}/>
          })}
        </div>}
        {(!requestsData.length) && <div className="grow flex justify-center items-center text-sm">
          <p>No requests found. &nbsp;</p>
          <button className="text-blue-600 hover:cursor-pointer hover:text-blue-800 active:text-blue-950 underline underline-offset-2" onClick={()=>{navigate("/request/title")}}>Create one.</button>
        </div>}
      </div>
    </div>
    </>
  )
}

export default Requests