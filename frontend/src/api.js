import axios from "axios";
const BASE_URL="http://localhost:5000";



export const fetchAllNhanVien = async () => { 
    try {
      const response = await axios.get(`${BASE_URL}/taikhoan/getAllNhanVien`);
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy user:", error);
      return { success: false, message: "Lỗi kết nối đến server" };
    }
  };