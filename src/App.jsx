// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Layout from "./components/Layout";
import COIDashboard from "./pages/COIDashboard";
import ContractVault from "./pages/ContractVault";
import AnalysisResult from "./pages/AnalysisResult";
import Settings from "./pages/Settings";
import NotFound from './pages/NotFound'
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/coi-dashboard" replace />} />
            <Route path="coi-dashboard" element={<COIDashboard />} />
            <Route path="contracts" element={<ContractVault />} />
            <Route path="analysis" element={<AnalysisResult />} />
            <Route path="settings" element={<Settings />} />
            <Route path="/notFound" element={<NotFound/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}