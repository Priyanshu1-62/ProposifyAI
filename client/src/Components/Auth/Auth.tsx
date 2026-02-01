import GeometryShapePattern from "../Decor/GeometryShapePattern"
import { FcGoogle } from "react-icons/fc";

function Auth() {
  return (
    <div className="flex justify-center items-center w-screen h-dvh px-16">
        <div className="h-full flex-1 flex flex-col justify-around items-center py-20">
            <div className="">
                <h1 className="text-6xl font-bold mb-6">
                    <span className="text-[#dd2d4a]">AI-Powered &nbsp;</span>
                    RFP Management Tool
                </h1>
                <h3>
                    Some information to fill. This checks how much width is consumed by this element. This much text should be sufficient to cause text wrap.
                </h3>
            </div>            
            <div className="w-full px-36">
                <button className="w-full flex justify-between items-center py-2 px-3 bg-stone-200 rounded-2xl hover:cursor-pointer hover:bg-stone-300 transition-all delay-75">
                    <FcGoogle className="text-2xl"/>
                    <p className="text-lg text-stone-700 font-bold">Continue With Google</p>
                    <FcGoogle className="invisible text-2xl"/>
                </button>
            </div>
        </div>
        <div className="flex-1">
            <GeometryShapePattern />
        </div>
    </div>
  )
}

export default Auth