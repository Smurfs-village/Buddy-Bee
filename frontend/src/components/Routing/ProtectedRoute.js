import { useAuth } from "../../contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import Swal from "sweetalert2"; // SweetAlert2 import 추가

const ProtectedRoute = () => {
  const { user } = useAuth();

  console.log("ProtectedRoute user:", user); // 디버깅용 콘솔 로그

  if (!user) {
    console.log("User not authenticated, redirecting to /login"); // 디버깅용 콘솔 로그
    Swal.fire({
      title: "로그인 후 이용 가능합니다",
      text: "",
      icon: "info",
      confirmButtonText: "확인",
    });
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
