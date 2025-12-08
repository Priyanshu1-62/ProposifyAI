import { FaRegEdit } from "react-icons/fa";
import type { resGroup } from "../../Models/resGroup"
import { useNavigate } from "react-router-dom";

function ResGroupItem({ element }: {element: resGroup}) {
  const navigate = useNavigate();
  const formatted = new Date(element.createdAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  return (
    <div className="text-sm px-5 py-5 border border-gray-300 border-b-gray-600 rounded-full hover:bg-neutral-200 hover:shadow-lg transition-all duration-300 ease-in-out">
        <div className="flex justify-between">
            <h4 className="text-neutral-600 font-bold truncate">{element.name}</h4>
            <button className="text-blue-900 hover:cursor-pointer" onClick={()=>{navigate(`/respondentGroup/update/${element.id}`)}}><FaRegEdit size={16}/></button>
        </div>
        <div className="mt-6 text-xs">
            <p>Created on: {formatted}</p>
        </div>
    </div>
  )
}

export default ResGroupItem