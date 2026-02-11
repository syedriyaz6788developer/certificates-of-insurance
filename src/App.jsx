import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import COIDashboard from "./pages/COIDashboard";
import ContractVault from "./pages/ContractVault";
import AnalysisResult from "./pages/AnalysisResult";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* 👇 Redirect root to /coi */}
          <Route index element={<Navigate to="/coi" replace />} />

          <Route path="coi-dashboard" element={<COIDashboard />} />
          <Route path="contracts" element={<ContractVault />} />
          <Route path="analysis" element={<AnalysisResult />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
