import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserState from "./Contexts/UserState";
import ReqTitle from "./Components/ReqTitle";

function App() {
  return (
    <BrowserRouter>
    <UserState>
      <Routes>
        <Route path="/" element={<ReqTitle/>} />
        <Route path="/newRequest" element={<ReqTitle/>} />
      </Routes>
    </UserState>
    </BrowserRouter>
  )
}

export default App
