import axios from "axios";

export const getHopDong = async (MaTK) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/HopDong/${MaTK}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy Phụ cấp:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const deleteHopDong = async (MaHDLD) => {
  try {
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/HopDong/${MaHDLD}`,
      {
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting HopDong:", error);
    throw error;
  }
};
export async function createHopDong(formData) {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/hopdong`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          // Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return { success: true, data: res.data };
  } catch (error) {
    if (error.response.status === 409) {
      return { sucesss: false, message: error.response.data.message };
    }
    console.error("Lỗi thêm hợp đồng:", error);
    return { sucesss: false, message: "Lỗi kết nối server" };
  }
}
export async function updateHopDong(MaHDLD) {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/HopDong/${MaHDLD}`
    );
    return { success: true, data: res.data };
  } catch (error) {
    if (error.response.status === 409) {
      return { sucesss: false, message: error.response.data.message };
    }
    console.error("Lỗi update phụ cấp:", error);
    return { sucesss: false, message: "Lỗi kết nối server" };
  }
}
