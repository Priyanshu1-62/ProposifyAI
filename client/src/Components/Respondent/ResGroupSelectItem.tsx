import { FaRegEdit } from "react-icons/fa";
import type { resGroup } from "../../Models/resGroup"
import { useNavigate } from "react-router-dom";
import type { resGroupSelectItemProps } from "../../Models/resGroupSelectItemProps";

function ResGroupSelectItem({ element, handleSelect }: resGroupSelectItemProps) {
  const navigate = useNavigate();
  const formatted = new Date(element.createdAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  return (
    <div className="text-sm px-2 py-3 border border-gray-300 border-b-gray-600 rounded-md hover:bg-neutral-200 hover:shadow-lg transition-all duration-300 ease-in-out">
        <div className="flex justify-between">
            <h4 className="text-neutral-600 font-bold truncate">{element.name}</h4>
            <input type="radio" value={element.id} onChange={()=>{handleSelect(element.id)}} name="respondentGroup" className="text-blue-900 hover:cursor-pointer"></input>
        </div>
        <div className="mt-6 text-xs">
            <p>Created on: {formatted}</p>
        </div>
    </div>
  )
}

export default ResGroupSelectItem