// import { useState, useContext } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
// import userContext from "../Contexts/userContext";
import { FcIdea } from "react-icons/fc";
import Optionbar from "./Optionbar";

function ReqTitle() {
  return (
    <>
    <Navbar />
    <div className="flex">
      <Sidebar />
      <div className="grow mt-14 mb-4">
        <h2 className="flex gap-1 px-14 items-center text-xl text-neutral-700 font-bold"><FcIdea/> Create a Request</h2>
        <Optionbar />
      </div>
    </div>
    </>
  )
}

export default ReqTitle