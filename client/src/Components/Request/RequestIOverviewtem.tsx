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
    <div className="relative px-2 py-3 text-sm border border-b-2 border-gray-300 border-b-gray-600 shadow-xl hover:bg-neutral-200 hover:shadow-2xl transition-all duration-300 ease-in-out">
        <h4 className="mb-6 text-neutral-600 font-bold">{element.title}</h4>
        <h6 className="text-xs">Created on: {formatted}</h6>
        <div className="flex justify-end px-2">
          <button className="text-sx text-blue-700 border-b border-b-blue-700 hover:cursor-pointer" onClick={()=>{navigate(`/requests`)}}>View</button>
        </div>
        <div className={`absolute -top-2 right-2 px-1 py-1 text-xs text-neutral-600 font-bold ${status==="CLOSED" ? "": "animate-bounce"} ${color} rounded-md shadow-xl`}>{element.status}</div>
    </div>
  )
}

export default RequestOverviewItem;