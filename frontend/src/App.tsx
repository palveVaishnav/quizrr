// import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./pages/Dashboard";
import Home from "./pages/Landingpage";
import TestPage from "./pages/TestPage";
import { TestComponent } from "./pages/StartTest";
import ResultPage from "./pages/SubmitPage";
import SucessPage from "./pages/SucessPage";
import NoPage from "./pages/Nopage";
import PacksPage from "./pages/Packs";
import TestsPage from "./pages/Tests";
import ProfilePage from "./pages/Profile";
import NotebookPage from "./pages/NotebookPage";
import ResultBoard from "./pages/Results";
import RankingPage from "./pages/Rankings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashboardLayout />} />

        {/* Should be nested routes  */}
        <Route path="/packs" element={<PacksPage />} />
        <Route path="/tests" element={<TestsPage />} />

        {/* Should be nested in the tests  */}
        <Route path="/test" element={<TestPage />} />
        <Route path="/startTest" element={<TestComponent id="cm20c3ptv0000lfozu1wnrjp1" />} />
        <Route path="/submitpage" element={<ResultPage />} />
        <Route path="/submitsucess" element={<SucessPage />} />
        <Route path="/results" element={<ResultBoard />} />
        <Route path="/rankings" element={<RankingPage />} />


        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notebook" element={<NotebookPage />} />
        <Route path="*" element={<NoPage />} />

      </Routes>
    </BrowserRouter>
  );
}