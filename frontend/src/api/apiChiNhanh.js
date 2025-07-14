import axios from "axios";
export const getChiNhanh = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/chinhanh`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy Chi nhánh:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const createChiNhanh = async (chiNhanhData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/chinhanh`,
      chiNhanhData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response?.status === 409) {
      return { success: false, message: error.response.data.message };
    }
    console.error("Lỗi thêm chi nhánh:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const updateChiNhanh = async (chiNhanhData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/chinhanh/${chiNhanhData.MaCN}`,
      chiNhanhData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response?.status === 409 || error.response?.status === 404) {
      return { success: false, message: error.response.data.message };
    }
    console.error("Lỗi sửa chi nhánh:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const deleteChiNhanh = async (maCN) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/chinhanh/${maCN}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response?.status === 404) {
      return { success: false, message: error.response.data.message };
    }
    console.error("Lỗi xóa chi nhánh:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};