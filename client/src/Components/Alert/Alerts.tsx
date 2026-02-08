import { useContext } from 'react';
import alertContext from '../../Contexts/alertContext';

function Alerts() {
  const {alertInfo}=useContext(alertContext)!;

  const bgColour={
    red: "bg-[#ff758f]", 
    green: "bg-[#06d6a0]",
    noColor: "bg-[#ffffff]"
  };
  return (
    <div className={`fixed top-[6.6vh] z-10 w-full ${bgColour[alertInfo.color]} flex items-center transition-opacity duration-150 ease-in-out ${(alertInfo.msg != "") ? "opacity-100 h-12" : "opacity-0 h-0"}`}>
      <div className="ml-6">
        <h3 className="text-sm font-bold inline">{`${alertInfo.msg}`}</h3>
      </div>
    </div>
  )
}

export default Alerts