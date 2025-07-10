import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PrivateRoutes = ({ children }) => {
  const navigate = useNavigate();

  const getRole = () => {
    const user = localStorage.getItem("user");
    if (!user) return null;
    const MaVaiTro = JSON.parse(user).MaVaiTro;
    return MaVaiTro;
  };

  useEffect(() => {
    let role = getRole();
    if (role === null) {
      navigate("/login", { replace: true });
    }
  }, []);

  return children;
};

export default PrivateRoutes;
