import axios from "axios";

export const fetchAllNhanVien = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/taikhoan/getAllNhanVienVaQuanLy`);
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy user:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const getAllQuanLyByChiNhanh = async (MaCN) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/taikhoan/getAllQuanLyByChiNhanh/${MaCN}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy user:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const searchEmployee = async (keyword) => {
  try {
    
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/taikhoan/search`, {
      params: { keyword }
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi tìm kiếm nhân viên:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};

// export const createDangKyCaByMaNS = async (MaNS) => {
//   try {
//     const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/dangkyca/${MaNS}`);
//     return response.data;
//   } catch (error) {
//     console.error("Lỗi lấy Ca làm:", error);
//     return { success: false, message: "Lỗi kết nối đến server" };
//   }
// };


export const login = async (Email, Password) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/taikhoan/login`, {
      Email,
      Password
    });
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response?.status === 404) {
      return { success: false, message: "Email không tồn tại" };
    } else if (error.response?.status === 401) {
      return { success: false, message: "Mật khẩu không đúng" };
    }
    console.error("Lỗi đăng nhập:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
}