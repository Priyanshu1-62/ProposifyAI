import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserState from "./Contexts/UserState";
import ReqTitle from "./Components/ReqTitle";
import Home from "./Components/Home";
import ReqDescription from "./Components/ReqDescription";
import ReqRespondent from "./Components/ReqRespondent";
import Requests from "./Components/Requests";

function App() {
  return (
    <BrowserRouter>
    <UserState>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/request/title" element={<ReqTitle/>} />
        <Route path="/request/description" element={<ReqDescription/>} />
        <Route path="/request/respondent" element={<ReqRespondent/>} />
        <Route path="/requests" element={<Requests/>} />
      </Routes>
    </UserState>
    </BrowserRouter>
  )
}

export default App
