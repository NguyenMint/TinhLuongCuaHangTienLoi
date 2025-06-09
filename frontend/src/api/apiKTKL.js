import axios from "axios";

export const createKTKL = async (formData) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/khenthuongkyluat`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy Bảng lương:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const getAllKTKL = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/khenthuongkyluat`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy Bảng lương:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
