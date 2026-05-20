import { useNavigate } from "react-router-dom";
import type { requestOverviewBody } from "../../Models/requestOverviewBody"
import { requestStatusColourMap } from "../../Models/requestStatusColourMap";


function RequestOverviewItem({ element }: { element: requestOverviewBody }) {
  const navigate = useNavigate();
  const formatted = new Date(element.createdAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  const status = element.status;
  const color = requestStatusColourMap[status];
  return (
    <div className="relative px-2 py-3 text-sm border border-b-2 text-blue-100 border-gray-600 border-b-gray-300 shadow-xl hover:bg-gray-800 hover:shadow-2xl transition-all duration-300 ease-in-out">
        <h4 className="mb-6 font-bold">{element.title}</h4>
        <h6 className="text-xs">Created on: {formatted}</h6>
        <div className="flex justify-end px-2">
          <button className="text-sx text-yellow-500 border-b border-b-yellow-500" onClick={()=>{navigate(`/requests`)}}>View</button>
        </div>
        <div className={`absolute -top-2 right-2 px-1 py-1 text-xs text-gray-950 font-bold ${status==="CLOSED" ? "": "animate-bounce"} ${color} rounded-md shadow-xl`}>{element.status}</div>
    </div>
  )
}

export default RequestOverviewItem;