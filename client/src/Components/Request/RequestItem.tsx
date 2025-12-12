import { useNavigate } from "react-router-dom";
import type { request } from "../../Models/request"


function RequestItem({ element }: { element: request }) {
  const navigate = useNavigate();
  const formatted = new Date(element.createdAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  return (
    <div className="relative px-2 py-3 text-sm border border-b-2 border-gray-300 border-b-gray-600 shadow-xl hover:bg-neutral-200 hover:shadow-2xl transition-all duration-300 ease-in-out">
        <h4 className="mb-6 text-neutral-600 font-bold">{element.title}</h4>
        <h6 className="text-xs">Created on: {formatted}</h6>
        <div className="flex justify-end px-2">
          <button className="text-sx text-blue-700 border-b border-b-blue-700 hover:cursor-pointer" onClick={()=>{navigate(`/requests/${element.id}/info`)}}>View</button>
        </div>
        <div className={`absolute -top-2 right-2 px-1 py-1 text-xs text-neutral-600 font-bold ${element.status==="pending"?"bg-yellow-400":"bg-green-400"} rounded-md shadow-xl animate-bounce`}>{element.status.toUpperCase()}</div>
    </div>
  )
}

export default RequestItem