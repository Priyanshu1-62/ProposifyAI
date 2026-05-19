import type { resGroupSelectItemProps } from "../../Models/resGroupSelectItemProps";

function ResGroupSelectItem({ element, handleSelect }: resGroupSelectItemProps) {
  const formatted = new Date(element.createdAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  return (
    <div className="text-sm px-2 py-3 text-blue-100 border border-gray-600 border-b-gray-300 rounded-md hover:bg-gray-800 hover:shadow-lg transition-all duration-300 ease-in-out">
        <div className="flex justify-between">
            <h4 className="font-bold truncate">{element.name}</h4>
            <input type="radio" value={element.id} onChange={()=>{handleSelect(element.id)}} name="respondentGroup" className="text-blue-900 hover:cursor-pointer"></input>
        </div>
        <div className="mt-6 text-xs">
            <p>Created on: {formatted}</p>
        </div>
    </div>
  )
}

export default ResGroupSelectItem