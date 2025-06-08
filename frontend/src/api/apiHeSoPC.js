import axios from 'axios';
export const getHeSoPhuCap = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/hesophucap`);
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy hệ số phụ cấp:", error);
    return { message: "Lỗi kết nối đến server" };
  }
};