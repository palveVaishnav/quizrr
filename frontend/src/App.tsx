// import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./pages/Dashboard";
import PaymentPage from "./pages/Payment";
import Home from "./pages/Home";
import TestPage from "./pages/TestPage";
import StartTest from "./pages/StartTest";
import { TestComponent } from "./pages/GptTest";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/startTest" element={<StartTest />} />
        <Route path="/gpt" element={<TestComponent id="cm1v3yniw0000jcau3lvlmvgr" />} />

        {/* <Route path="*" element={<NoPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}