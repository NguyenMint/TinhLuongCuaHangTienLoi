import axios from "axios";
export const fetchLichLamViec = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/lichlamviec`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy Ca làm:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const fetchLLVByNhanVien = async (MaNV, NgayDangKy) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/lichlamviec/getCaLamByNhanVien/${MaNV}?NgayDangKy=${NgayDangKy}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy ĐK Ca theo nhân viên:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const deleteLichLamViec = async (MaDKC) => {
  try {
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/lichlamviec/${MaDKC}`
    );
    return { success: true, data: response.data.message };
  } catch (error) {
    if (error.response?.status === 404) {
      return { success: false, message: "Đăng ký ca làm không tồn tại" };
    } else if (error.response.status === 400) {
      return {
        success: false,
        message: "Không thể xóa đăng ký ca làm khi đã có chấm công",
      };
    }
    console.error("Lỗi xóa ĐK Ca:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const updateLLV = async (MaDKC, status) => {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/lichlamviec`,
      { MaDKC, status }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi cập nhật đăng ký ca:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
