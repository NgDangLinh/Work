import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Investors from "./pages/Investors";
import InvestorDetail from "./pages/InvestorDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
    <Route path="/investors" element={<Investors />} />
    <Route
        path="/investors/:investorCode"
        element={<InvestorDetail />}
    />
</Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;