import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.MaVaiTro)) {
    if (user.MaVaiTro === 2) {
      return <Navigate to="/employee-home" replace />;
    }
    return <Navigate to="/" replace />;
  }
  return children;
}