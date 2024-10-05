// import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./pages/Dashboard";
import PaymentPage from "./pages/Payment";
import Home from "./pages/Home";
import TestPage from "./pages/TestPage";
import StartTest from "./pages/StartTest";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/startTest" element={<StartTest />} />
        {/* <Route path="*" element={<NoPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}