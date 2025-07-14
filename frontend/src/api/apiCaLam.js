import axios from "axios";
export const fetchCaLam = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/calam`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy Ca làm:", error);
    return { message: "Lỗi kết nối đến server" };
  }
};
export const createCaLam = async (caLamData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/calam`,
      caLamData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response.status === 409) {
      return { success: false, message: error.response.data.message };
    }
    console.error("Lỗi tạo Ca làm:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const updateCaLam = async (caLamData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/calam/${caLamData.MaCa}`,
      caLamData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response.status === 404 || error.response.status === 409) {
      return { success: false, message: error.response.data.message };
    }
    console.error("Lỗi tạo Ca làm:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const deleteCaLam = async (MaCaLam) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/calam/${MaCaLam}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: response.data.message };
  } catch (error) {
    if (error.response.status === 404) {
      return { success: false, message: error.response.data.message };
    }
    console.error("Lỗi tạo Ca làm:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
