import { useContext } from "react";
import { startGoogleOAuth } from "../../services/oAuthService/oauth.startGoogleOAuth";
import GeometryShapePattern from "../Decor/GeometryShapePattern"
import { FcGoogle } from "react-icons/fc";
import alertContext from "../../Contexts/alertContext";
import { AiFillGithub } from "react-icons/ai";

function Auth() {
  const { handleAlert } = useContext(alertContext)!;
  
  const handleGoogleOAuthOnClick = () => {
    try {
        startGoogleOAuth();
    } 
    catch (error) {
        handleAlert({color: "red", msg: "Unable to initiate Google OAuth process."});
    }
  }
  return (
    <div className="flex flex-col w-screen h-dvh px-6 md:px-10 lg:px-12">
        <div className="flex justify-between items-center pt-7">
            <div className="flex items-center gap-2">
                <img src="/favicon.ico" alt="ProposifyAI logo" className="w-5"></img>
                <h3 className="font-bold text-stone-800">ProposifyAI</h3>
            </div>
            <div>
                <a href="https://github.com/Priyanshu1-62" target="_blank" rel="noopener noreferrer" className="text-3xl"><AiFillGithub /></a>
            </div>
        </div>
        <div className="grow flex justify-center items-center">
            <div className="h-full flex-1 flex flex-col justify-around items-center py-12 md:py-14 lg:py-20">
                <div className="">
                    <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-3 md:mb-4 lg:mb-6">
                        <span className="text-[#dd2d4a]">AI-Powered &nbsp;</span>
                        RFP Management Tool
                    </h1>
                    <h3>
                        Describe requests in natural language, manage respondents effortlessly, send invitations in a single click, track email delivery status in real time, and compare responses through AI-powered evaluation.
                    </h3>
                </div>            
                <div className="w-full px-7 md:px-8 lg:px-20">
                    <button className="w-full flex justify-between items-center py-2 px-3 bg-[#d8e3cf] rounded-2xl hover:cursor-pointer hover:bg-[#b9c4b0] active:bg-[#b9c6ae] transition-all delay-75" onClick={handleGoogleOAuthOnClick}>
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
    </div>
  )
}

export default Auth