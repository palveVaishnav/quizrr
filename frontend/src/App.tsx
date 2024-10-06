// import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./pages/Dashboard";
import Home from "./pages/Home";
import TestPage from "./pages/TestPage";
import { TestComponent } from "./pages/StartTest";
import ResultPage from "./pages/SubmitPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/startTest" element={<TestComponent id="cm1v3yniw0000jcau3lvlmvgr" />} />
        <Route path="/submitpage" element={<ResultPage />} />
        {/* <Route path="*" element={<NoPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}