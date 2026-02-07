import { useState, useEffect } from "react";
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


function ResGroup() {
  const id = useParams().id!;
  const navigate = useNavigate();
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
    <div className="h-[93.4vh] flex">
      <Sidebar />
      <div className="grow mt-14 overflow-y-auto">
        <h2 className="flex gap-2 items-center px-14 text-xl text-neutral-700 font-bold"><FcCollaboration size={24}/>{groupData.name?groupData.name:""}</h2>
        <div className="flex flex-row gap-1 items-center px-16 mt-10 text-sm">
          <p>Add respondents, then use the group to</p>
          <button className="text-blue-600 border-b border-blue-600 hover:cursor-pointer" onClick={()=>{navigate('/request/title')}}>create</button>
          <p>a request.</p>
        </div>
        <div className="mx-16 mt-5 text-sm">
          <div className="flex justify-between px-2 bg-stone-200 border border-t-8 border-t-teal-600 rounded-t-md">
            <div className="flex justify-center py-2 border-r basis-[20%] grow">Sr. No</div>
            <div className="flex justify-center py-2 border-r basis-[40%] grow">Name of Respondent</div>
            <div className="flex justify-center py-2 basis-[40%] grow">Email Address</div>
          </div>
          {respondents.map((element, index)=>{
              return <ResItem key={index} element={element} index={index}/>
          })}
          {addingRespondent && 
          <>
          <form onSubmit={handleAddRespondent} className="">
            <div className="flex justify-between px-2 text-sm border-2 border-blue-600 border-t-blue-300">
              <div className="flex justify-center py-2 border-r basis-[20%] grow">{respondents.length + 1}</div>
              <input name="name" value={currData.name} onChange={(e) => setCurrData(prev => ({...prev, "name": e.target.value}))} className="py-2 px-2 border-r basis-[40%] grow placeholder:text-sm focus:outline-none" type="text" placeholder="Enter Respondent name"></input>
              <input name="email" value={currData.email} onChange={(e) => setCurrData(prev => ({...prev, "email": e.target.value}))} className="py-2 px-2 basis-[40%] grow placeholder:text-sm focus:outline-none" type="text" placeholder="Enter Email Address"></input>
            </div>
            <div className="flex gap-4 my-5">
              <button type="submit" className="flex gap-1 items-center px-4 py-2 bg-emerald-400 border-2 border-green-300 hover:bg-emerald-500 hover:cursor-pointer hover:shadow-xl active:bg-emerald-600 rounded-2xl"><MdDownloadDone size={18}/> Add to Group</button>
              <button type="button" className="flex gap-1 items-center px-4 py-2 bg-red-400 border-2 border-pink-300 hover:bg-red-500 hover:cursor-pointer hover:shadow-xl active:bg-red-600 rounded-2xl" onClick={handleResetForm}><RxCross2 size={18}/> Cancel</button>
            </div>
          </form>
          </>
          }
          {!addingRespondent && <button className="flex gap-1 items-center my-5 px-4 py-2  hover:cursor-pointer hover:shadow-xl active:bg-amber-600 rounded-2xl" onClick={handleCreateRespondent}><FaRegAddressCard size={18}/> Add a Respondent</button>}
        </div>
      </div>
    </div>
    </>
  )
}

export default ResGroup