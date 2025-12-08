import { useContext } from "react";
import userContext from "../../Contexts/userContext";
import { TbLayoutSidebarRightCollapseFilled, TbLayoutSidebarLeftCollapseFilled } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const { sidebar, setSidebar } = useContext(userContext)!;
  return (
    <div className="flex justify-between items-center h-[6.6vh] px-4 border border-b-gray-300">
        <span>
            {sidebar && <button className="text-2xl text-gray-600 cursor-pointer" onClick={()=>{setSidebar(prev => !prev)}}><TbLayoutSidebarLeftCollapseFilled/></button>}
            {!sidebar && <button className="text-2xl text-gray-600 cursor-pointer" onClick={()=>{setSidebar(prev => !prev)}}><TbLayoutSidebarRightCollapseFilled/></button>}
        </span>
        <h4 className="font-bold text-purple-700 hover:text-purple-800 hover:cursor-pointer" onClick={()=>{navigate("/")}}>ProposifyAI</h4>
        <span className="">

        </span>
    </div>
  )
}

export default Navbar