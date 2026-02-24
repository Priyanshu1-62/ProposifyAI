import { useState, useEffect, useContext } from "react";
import Navbar from "../UtilityBars/Navbar";
import Sidebar from "../UtilityBars/Sidebar";
import { FcCollaboration } from "react-icons/fc";
import { FaRegAddressCard } from "react-icons/fa";
import { MdDownloadDone } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import ResItem from "./ResItem";
import type { respondent } from "../../Models/respondent";
import Alerts from "../Alert/Alerts";
import { useParams } from "react-router-dom";
import type { resGroup } from "../../Models/resGroup";
import { addRespondent } from "../../services/respondentService/addRespondent";
import { getRespondentGroup } from "../../services/respondentService/getRespondentGroup";
import { getRespondents } from "../../services/respondentService/getRespondents";
import alertContext from "../../Contexts/alertContext";


function ResGroup() {
  const id = useParams().id!;
  const navigate = useNavigate();
  const { handleApiResponse } = useContext(alertContext)!;
  const [ currData, setCurrData ] = useState<respondent>({name: "", email: "", groupId: ""});
  const [addingRespondent, setAddingRespondent] = useState(false);
  const [groupData, setGroupData] = useState<resGroup>({id: id, name: "", createdAt: "", userId: ""});
  const [respondents, setRespondents] = useState([]);
 
  const handleCreateRespondent = () => {
    setCurrData({name: "", email: "", groupId: id});
    setAddingRespondent(true);
  }

  const handleAddRespondent = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await addRespondent(currData);

    if(result.ok){
      await getRespondentsData(id);
      handleResetForm();
    }
    else if(result.status === 401){
      navigate("/");
    }
    else{
      handleApiResponse(result, "Respondent added successfully !!");
    }
  }

  const handleResetForm = () => {
    setAddingRespondent(false);
  }

  const getGroupData = async (id: string) => {
    const result = await getRespondentGroup(id);
    if(result.status == 200){
        setGroupData(result.data.group);
    }
    else if(result.status === 401){
      navigate("/");
    }
  }

  const getRespondentsData = async (id: string) => {
    const result = await getRespondents(id);
    if(result.status == 200){
        setRespondents(result.data.respondents);
    }
    else if(result.status === 401){
      navigate("/");
    }
  }

  useEffect(()=>{
    getGroupData(id);
    getRespondentsData(id);
  }, [id]);
  return (
    <>
    <Navbar />
    <Alerts />
    <div className="">
      <Sidebar />
      <div className="h-[93.4vh] mt-14 overflow-y-auto">
        <h2 className="flex gap-2 items-center px-6 md:px-10 lg:px-14 text-xl text-neutral-700 font-bold"><FcCollaboration size={24}/>{groupData.name?groupData.name:""}</h2>
        <div className="flex flex-wrap gap-1 px-6 md:px-10 lg:px-14 mt-10 text-sm">
          <p>Add respondents, then use the group to &nbsp;</p>
          <button className="text-blue-600 border-b border-blue-600 hover:cursor-pointer" onClick={()=>{navigate('/request/title')}}>create</button>
          <p>a request.</p>
        </div>
        <div className="mx-6 md:mx-10 lg:mx-14 mt-5 text-xs">
          <div className="flex px-2 bg-stone-200 border border-t-8 border-t-teal-600 rounded-t-md">
            <div className="flex justify-center py-2 border-r basis-[20%] grow">Sr. No</div>
            <div className="flex justify-center py-2 border-r basis-[40%] grow">Respondent Name</div>
            <div className="flex justify-center py-2 basis-[40%] grow">Email Address</div>
          </div>
          {respondents.map((element, index)=>{
              return <ResItem key={index} element={element} index={index}/>
          })}
          {addingRespondent && 
          <>
          <form onSubmit={handleAddRespondent} className="text-xs">
            <div className="flex px-2 border-2 border-blue-600 border-t-blue-300">
              <div className="flex justify-center py-2 border-r basis-[20%] grow">{respondents.length + 1}</div>
              <input name="name" value={currData.name} onChange={(e) => setCurrData(prev => ({...prev, "name": e.target.value}))} className="py-2 px-2 border-r min-w-0 basis-[40%] grow placeholder:text-xs focus:outline-none" type="text" placeholder="Name"></input>
              <input name="email" value={currData.email} onChange={(e) => setCurrData(prev => ({...prev, "email": e.target.value}))} className="py-2 px-2 min-w-0 basis-[40%] grow placeholder:text-xs focus:outline-none" type="text" placeholder="Email"></input>
            </div>
            <div className="flex gap-4 my-5">
              <button type="submit" className="flex gap-1 items-center px-4 py-2 border-2 border-green-300 hover:bg-emerald-500 hover:cursor-pointer hover:shadow-xl active:bg-emerald-600 rounded-2xl"><MdDownloadDone size={18}/> Add to Group</button>
              <button type="button" className="flex gap-1 items-center px-4 py-2 bg-red-400 border-2 border-pink-300 hover:bg-red-500 hover:cursor-pointer hover:shadow-xl active:bg-red-600 rounded-2xl" onClick={handleResetForm}><RxCross2 size={18}/> Cancel</button>
            </div>
          </form>
          </>
          }
          {!addingRespondent && <button className="flex gap-1 items-center my-5 px-4 py-2  hover:cursor-pointer hover:shadow-xl active:bg-gray-200 rounded-2xl" onClick={handleCreateRespondent}><FaRegAddressCard size={18}/> Add a Respondent</button>}
        </div>
      </div>
    </div>
    </>
  )
}

export default ResGroup