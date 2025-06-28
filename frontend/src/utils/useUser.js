import { useState, useEffect, useCallback } from "react";
import { refreshUserInfo } from "../api/apiTaiKhoan";

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy user từ localStorage khi khởi tạo
  useEffect(() => {
    const userFromStorage = localStorage.getItem("user");
    if (userFromStorage) {
      try {
        const parsedUser = JSON.parse(userFromStorage);
        setUser(parsedUser);
      } catch (error) {
        console.error("Lỗi parse user từ localStorage:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // Function để refresh thông tin user từ server
  const refreshUser = useCallback(async () => {
    if (!user?.MaTK) return;

    setLoading(true);
    try {
      const result = await refreshUserInfo(user.MaTK);
      if (result.success) {
        // Cập nhật localStorage với thông tin mới
        const updatedUser = {
          ...user,
          ...result.data,
          // Giữ lại các field từ JWT token nếu có
          TenChiNhanh: result.data.MaCN_chi_nhanh?.TenChiNhanh,
          DiaChiCN: result.data.MaCN_chi_nhanh?.DiaChi,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        return updatedUser;
      }
    } catch (error) {
      console.error("Lỗi refresh user:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Function để cập nhật user state (dùng khi quản lý update thông tin)
  const updateUser = useCallback(
    (newUserData) => {
      const updatedUser = { ...user, ...newUserData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    },
    [user]
  );

  return {
    user,
    loading,
    refreshUser,
    updateUser,
  };
};
