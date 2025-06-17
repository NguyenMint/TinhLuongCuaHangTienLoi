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
export const deleteKTKL = async (maKTKL) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/khenthuongkyluat/${maKTKL}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error deleting KTKL:", error);
    throw error;
  }
};
