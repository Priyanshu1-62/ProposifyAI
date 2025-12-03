import { useContext } from 'react';
import userContext from "../Contexts/userContext";
import { FaPlus } from "react-icons/fa6";
import { GrTasks } from "react-icons/gr";
import { FaPeopleGroup } from "react-icons/fa6";

function Sidebar() {
  const { sidebar } = useContext(userContext)!;
  return (
    <>
    {sidebar && <div className="w-60 h-[93.4vh] py-2 px-2 border-r border-gray-300">
      <ul className="flex flex-col gap-2 mt-2 text-sm text-gray-800">
        <li>
          <button className="w-full flex gap-2 items-center px-2 py-2 hover:bg-gray-300 hover:cursor-pointer rounded-xl"><FaPlus size={18}/> Create Request</button>
        </li>
        <li>
          <button className="w-full flex gap-2 items-center px-2 py-2 hover:bg-gray-300 hover:cursor-pointer rounded-xl"><GrTasks size={18}/> My Requests</button>
        </li>
        <li>
          <button className="w-full flex gap-2 items-center px-2 py-2 hover:bg-gray-300 hover:cursor-pointer rounded-xl"><FaPlus size={18}/> Add Respondent group</button>
        </li>
        <li>
          <button className="w-full flex gap-2 items-center px-2 py-2 hover:bg-gray-300 hover:cursor-pointer rounded-xl"><FaPeopleGroup size={18}/> My Respondent groups</button>
        </li>
      </ul>
    </div>}
    </>
  )
}

export default Sidebar