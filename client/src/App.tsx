import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import UserState from "./Contexts/userState";

function App() {
  return (
    <BrowserRouter>
    <UserState>
      <Routes>
        <Route path="/" element={<Home/>} />
      </Routes>
    </UserState>
    </BrowserRouter>
  )
}

export default App
