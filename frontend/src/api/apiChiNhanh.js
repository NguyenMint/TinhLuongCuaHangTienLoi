import axios from "axios";
export const getChiNhanh = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/chinhanh`);
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy Chi nhánh:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};