import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserState from "./Contexts/UserState";
import ReqTitle from "./Components/Request/ReqTitle";
import Home from "./Components/Home/Home";
import ReqDescription from "./Components/Request/ReqDescription";
import ReqRespondent from "./Components/Request/ReqRespondent";
import Requests from "./Components/Request/Requests";
import ResGroupCreate from "./Components/Respondent/ResGroupCreate";
import AlertState from "./Contexts/AlertState";
import RespondentState from "./Contexts/RespondentState";
import ResGroupUpdate from "./Components/Respondent/ResGroupUpdate";
import ResGroups from "./Components/Respondent/ResGroups";
import RequestState from "./Contexts/RequestState";
import RequestInfo from "./Components/Request/RequestInfo";
import Auth from "./Components/Auth/Auth";

function App() {
  return (
    <BrowserRouter>
    <AlertState>
      <UserState>
        <RespondentState>
          <RequestState>
            <Routes>
              <Route path="/" element={<Auth />} />
              <Route path="/home" element={<Home />} />
              <Route path="/request/title" element={<ReqTitle />} />
              <Route path="/request/description" element={<ReqDescription />} />
              <Route path="/request/respondent" element={<ReqRespondent />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/requests/:id/info" element={<RequestInfo />} />
              <Route path="/respondentGroup/create" element={<ResGroupCreate />} />
              <Route path="/respondentGroup/update/:id" element={<ResGroupUpdate />} />
              <Route path="/respondentGroups" element={<ResGroups />} />
            </Routes>
          </RequestState>
        </RespondentState>
      </UserState>
    </AlertState>
    </BrowserRouter>
  )
}

export default App
