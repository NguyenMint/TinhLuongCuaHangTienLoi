import axios from "axios";
export const fetchCaLam = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/calam`);
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy Ca làm:", error);
    return { message: "Lỗi kết nối đến server" };
  }
};
export const getDetailCaLam = async (MaCaLam) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/calam/${MaCaLam}`);
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
    if (error.response?.status === 409) {
      return { success: false, message: "Tên ca làm đã tồn tại" };
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
    if (error.response.status === 404) {
      return { success: false, message: "Ca làm không tồn tại" };
    }else if(error.response.status === 409){
      return { success: false, message: "Tên ca làm đã tồn tại" };
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
    if (error.response?.status === 404) {
      return { success: false, message: "Ca làm không tồn tại" };
    }
    console.error("Lỗi tạo Ca làm:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};