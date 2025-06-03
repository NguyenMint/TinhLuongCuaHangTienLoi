import axios from "axios";
export const fetchDangKyCa = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/dangkyca`);
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy Ca làm:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const fetchDKCByNhanVien = async (MaNV,NgayDangKy) =>{
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/dangkyca/getCaLamByNhanVien/${MaNV}?NgayDangKy=${NgayDangKy}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy ĐK Ca theo nhân viên:", error);
      return { success: false, message: "Lỗi kết nối đến server" };
    }
}