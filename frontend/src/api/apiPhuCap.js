import axios from "axios";

export const getAllPhuCap = async (MaTK) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/phucap/${MaTK}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy Phụ cấp:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const deletePhuCap = async (MaPhuCap) => {
  try {
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/phucap/${MaPhuCap}`,
      {
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting phucap:", error);
    throw error;
  }
};
export async function createPhuCap(formData) {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/phucap`,
      formData
    );
    return { success: true, data: res.data };
  } catch (error) {
    if (error.response.status === 409) {
      return { sucesss: false, message: error.response.data.message };
    }
    console.error("Lỗi thêm phụ cấp:", error);
    return { sucesss: false, message: "Lỗi kết nối server" };
  }
}
export async function updatePhuCap(MaPhuCap) {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/phucap/${MaPhuCap}`
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
