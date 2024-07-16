import { useAuth } from "../../contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { user } = useAuth();

  console.log("ProtectedRoute user:", user); // 디버깅용 콘솔 로그

  if (!user) {
    console.log("User not authenticated, redirecting to /login"); // 디버깅용 콘솔 로그
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
