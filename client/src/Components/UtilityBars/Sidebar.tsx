import { useContext } from 'react';
import userContext from "../../Contexts/userContext";
import { useNavigate } from 'react-router-dom';
import { FaPlus } from "react-icons/fa6";
import { GrTasks } from "react-icons/gr";
import { FaPeopleGroup } from "react-icons/fa6";
import { BiLogOut } from "react-icons/bi";
import { sessionLogout } from '../../services/sessionService/sessionLogout';
import alertContext from '../../Contexts/alertContext';

function Sidebar() {
  const navigate = useNavigate();
  const { sidebar } = useContext(userContext)!;
  const { handleApiResponse } = useContext(alertContext)!;

  const handleLogout = async () => {
    const result = await sessionLogout();

    handleApiResponse(result, "Log Out successful !!");
    navigate("/", { replace: true });
  }
  return (
    <>
    {sidebar && <div className="w-60 h-[93.4vh] flex flex-col justify-between py-2 px-2 text-sm text-white bg-[#3c3744] border-r border-gray-300">
      <ul className="flex flex-col gap-2 mt-2">
        <li>
          <button className="w-full flex gap-2 items-center px-2 py-2 hover:bg-[#686274] active:bg-[#797385] hover:cursor-pointer rounded-xl transition-all delay-75" onClick={()=>{navigate("/request/title")}}><FaPlus size={18}/> Create Request</button>
        </li>
        <li>
          <button className="w-full flex gap-2 items-center px-2 py-2 hover:bg-[#686274] active:bg-[#797385] hover:cursor-pointer rounded-xl transition-all delay-75" onClick={()=>{navigate("/requests")}}><GrTasks size={18}/> My Requests</button>
        </li>
        <li>
          <button className="w-full flex gap-2 items-center px-2 py-2 hover:bg-[#686274] active:bg-[#797385] hover:cursor-pointer rounded-xl transition-all delay-75" onClick={()=>{navigate("/respondentGroup/create")}}><FaPlus size={18}/> Add Respondent group</button>
        </li>
        <li>
          <button className="w-full flex gap-2 items-center px-2 py-2 hover:bg-[#686274] active:bg-[#797385] hover:cursor-pointer rounded-xl transition-all delay-75" onClick={()=>{navigate("/respondentGroups")}}><FaPeopleGroup size={18}/> My Respondent groups</button>
        </li>
      </ul>
      <div className='w-full flex gap-4 justify-around items-center px-2 py-2 hover:bg-[#686274] active:bg-[#797385] hover:cursor-pointer rounded-xl transition-all delay-75' onClick={handleLogout}>
        <BiLogOut className="font-bold"  size={21}/>
        <p>Log Out</p>
        <BiLogOut className='invisible'  size={21}/>
      </div>
    </div>}
    </>
  )
}

export default Sidebar