import { startGoogleOAuth } from "../../services/oAuthService/startGoogleOAuth";
import GeometryShapePattern from "../Decor/GeometryShapePattern"
import { FcGoogle } from "react-icons/fc";

function Auth() {
  const handleGoogleOAuthOnClick = () => {
    startGoogleOAuth();
  }
  return (
    <div className="flex justify-center items-center w-screen h-dvh px-6 md:px-10 lg:px-16">
        <div className="h-full flex-1 flex flex-col justify-around items-center py-12 md:py-14 lg:py-20">
            <div className="">
                <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-3 md:mb-4 lg:mb-6">
                    <span className="text-[#dd2d4a]">AI-Powered &nbsp;</span>
                    RFP Management Tool
                </h1>
                <h3>
                    Some information to fill. This checks how much width is consumed by this element. This much text should be sufficient to cause text wrap.
                </h3>
            </div>            
            <div className="w-full px-14 md:px-10 lg:px-20">
                <button className="w-full flex justify-between items-center py-2 px-3 bg-stone-200 rounded-2xl hover:cursor-pointer hover:bg-stone-300 transition-all delay-75" onClick={handleGoogleOAuthOnClick}>
                    <FcGoogle className="text-xl lg:text-2xl"/>
                    <p className="lg:text-lg text-stone-700 font-bold">Continue With Google</p>
                    <FcGoogle className="invisible text-xl lg:text-2xl"/>
                </button>
            </div>
        </div>
        <div className="hidden md:flex flex-1 justify-center">
            <GeometryShapePattern />
        </div>
    </div>
  )
}

export default Auth