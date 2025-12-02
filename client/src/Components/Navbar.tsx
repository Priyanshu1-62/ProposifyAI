import { useContext } from "react";
import userContext from "../Contexts/userContext";
import { TbLayoutSidebarRightCollapseFilled, TbLayoutSidebarLeftCollapseFilled } from "react-icons/tb";

function Navbar() {
  const { sidebar, setSidebar } = useContext(userContext)!;
  return (
    <div className="flex justify-between h-[6.6vh] px-4 py-2 border border-b-gray-400">
        <span>
            {sidebar && <button className="text-2xl text-gray-600 cursor-pointer" onClick={()=>{setSidebar(prev => !prev)}}><TbLayoutSidebarLeftCollapseFilled/></button>}
            {!sidebar && <button className="text-2xl text-gray-600 cursor-pointer" onClick={()=>{setSidebar(prev => !prev)}}><TbLayoutSidebarRightCollapseFilled/></button>}
        </span>
        <h4 className="text-gray-800 font-bold">ProposifyAI</h4>
        <span className="">

        </span>
    </div>
  )
}

export default Navbar