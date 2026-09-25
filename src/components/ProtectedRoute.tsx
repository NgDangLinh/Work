import { Navigate, Outlet } from "react-router-dom";
import { authStorage } from "../api/authStorage";

function ProtectedRoute() {
  const accessToken = authStorage.getAccessToken();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;