import { BrowserRouter, Routes, Route } from "react-router-dom";
import Principal from "./pages/Principal";
import Login from "./pages/login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Principal" element={<Principal />} />
      </Routes>
    </BrowserRouter>
  );
}