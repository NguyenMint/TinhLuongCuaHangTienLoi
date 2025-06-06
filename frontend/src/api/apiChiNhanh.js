import axios from "axios";
export const getChiNhanh = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/chinhanh`);
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy Ca làm:", error);
    return { message: "Lỗi kết nối đến server" };
  }
};