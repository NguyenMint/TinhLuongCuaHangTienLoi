import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { refreshUserInfo } from "../../api/apiTaiKhoan";

export const RefreshUserInfo = ({ onRefresh }) => {
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser?.MaTK) {
      alert("Không tìm thấy thông tin người dùng!");
      return;
    }

    setLoading(true);
    try {
      const result = await refreshUserInfo(currentUser.MaTK);
      if (result.success) {
        // Cập nhật localStorage với thông tin mới
        const updatedUser = {
          ...currentUser,
          ...result.data,
          // Giữ lại các field từ JWT token
          TenChiNhanh: result.data.MaCN_chi_nhanh?.TenChiNhanh,
          DiaChiCN: result.data.MaCN_chi_nhanh?.DiaChi,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Gọi callback để parent component có thể cập nhật UI
        if (onRefresh) {
          onRefresh(updatedUser);
        }

        alert("Đã cập nhật thông tin cá nhân thành công!");
      } else {
        alert(
          "Không thể cập nhật thông tin: " +
            (result.message || "Lỗi không xác định")
        );
      }
    } catch (error) {
      console.error("Lỗi refresh user:", error);
      alert("Lỗi khi cập nhật thông tin cá nhân!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={loading}
      className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-md transition-colors"
      title="Cập nhật thông tin cá nhân"
    >
      <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
      {loading ? "Đang cập nhật..." : "Cập nhật thông tin"}
    </button>
  );
};
