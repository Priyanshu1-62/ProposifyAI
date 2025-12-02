import { useContext } from 'react';
import userContext from "../Contexts/userContext";

function Sidebar() {
  const { sidebar } = useContext(userContext)!;
  return (
    <>
    {sidebar && <div className="flex flex-col w-60 h-[93.4vh] py-2 px-2 border-r border-r-gray-400">
      <div>Home</div>
    </div>}
    </>
  )
}

export default Sidebar