import type { resItemProps } from "../../Models/resItemProps"


function ResItem({element, index}: resItemProps) {
  return (
    <div className="flex justify-between text-stone-700 border border-t-white px-2 bg-stone-200">
      <div className="flex justify-center py-2 border-r basis-[20%] grow">{index + 1}</div>
      <div className="flex justify-center py-2 border-r basis-[40%] grow truncate">{element.name}</div>
      <div className="flex justify-center py-2 basis-[40%] grow truncate">{element.email}</div>
    </div>
  )
}

export default ResItem