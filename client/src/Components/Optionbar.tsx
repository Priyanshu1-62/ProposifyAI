import { BsBalloonFill } from "react-icons/bs";
import { TfiWrite } from "react-icons/tfi";
import { FaPeopleArrows } from "react-icons/fa";

function Optionbar() {
  return (
    <ul className="flex w-full my-4 px-10 text-sm border-b border-gray-300">
        <li>
            <button className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-neutral-700 border-b-4 border-white hover:text-blue-600 hover:border-blue-600 hover:cursor-pointer"><BsBalloonFill/> Title</button>
        </li>
        <li>
            <button className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-neutral-700 border-b-4 border-white hover:text-blue-600 hover:border-blue-600 hover:cursor-pointer"><TfiWrite/> Description</button>
        </li>
        <li>
            <button className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-neutral-700 border-b-4 border-white hover:text-blue-600 hover:border-blue-600 hover:cursor-pointer"><FaPeopleArrows/> Respondent</button>
        </li>
    </ul>
  )
}

export default Optionbar