import axios from "axios";
export const getChungChi = async (matk) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/chungchi/getbymatk/${matk}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy Chi nhánh:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export async function createChungChi(formData) {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/chungchi`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return { success: true, data: res.data };
  } catch (error) {
    if (error.response.status === 409) {
      return { sucesss: false, message: error.response.data.message };
    }
    console.error("Lỗi thêm chứng chỉ:", error);
    return { sucesss: false, message: "Lỗi kết nối server" };
  }
}
export const deleteChungChi = async (MaCC) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/chungchi/${MaCC}`,
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
    console.error("Error deleting ChungChi:", error);
    throw error;
  }
};
export async function updateChungChi(formData) {
  try {
    const MaCC = formData.get("MaCC");
    const res = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/chungchi/${MaCC}`,
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
    console.error("Lỗi update chứng chỉ:", error);
    return { sucesss: false, message: "Lỗi kết nối server" };
  }
}
