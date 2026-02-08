import { useLocation, useNavigate } from "react-router-dom";
import { BsBalloonFill } from "react-icons/bs";
import { TfiWrite } from "react-icons/tfi";
import { FaPeopleArrows } from "react-icons/fa";

export default function RequestOptionbar() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <ul className="flex gap-1 w-full my-4 px-4 md:px-7 lg:px-10 text-sm border-b border-gray-300">
        <li>
            <button className={`flex items-center gap-1 px-2 md:px-3 lg:px-4 py-2 text-sm font-bold border-b-4 hover:border-blue-600 hover:text-blue-600 hover:cursor-pointer ${location.pathname==="/request/title" ? "border-blue-600 text-blue-600": "border-white text-neutral-500"}`} onClick={()=>{navigate("/request/title")}}><BsBalloonFill/> Title</button>
        </li>
        <li>
            <button className={`flex items-center gap-1 px-2 md:px-3 lg:px-4 py-2 text-sm font-bold border-b-4 hover:border-blue-600 hover:text-blue-600 hover:cursor-pointer ${location.pathname==="/request/description" ? "border-blue-600 text-blue-600": "border-white text-neutral-500"}`} onClick={()=>{navigate("/request/description")}}><TfiWrite/> Description</button>
        </li>
        <li>
            <button className={`flex items-center gap-1 px-2 md:px-3 lg:px-4 py-2 text-sm font-bold border-b-4 hover:border-blue-600 hover:text-blue-600 hover:cursor-pointer ${location.pathname==="/request/respondent" ? "border-blue-600 text-blue-600": "border-white text-neutral-500"}`} onClick={()=>{navigate("/request/respondent")}}><FaPeopleArrows/> Respondent</button>
        </li>
    </ul>
  )
}