import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Main from "./components/Main";
import Login from "./components/Login";
import EmailVerify from "./components/EmailVerify";

function App() {
  const user = localStorage.getItem("token");
  return (
    <Routes>
      {user && <Route path="/" exact element={<Main />} />}
      <Route path="/signup" exact element={<Signup />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/" exact element={<Navigate replace to="/login" />} />
      <Route path="/users/:id/verify/:token" element={<EmailVerify />} />
    </Routes>
  );
}

export default App;
