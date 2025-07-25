import axios from "axios";
const API_URL = process.env.REACT_APP_BACKEND_URL + "/nghithaisan";

export const getAllNghiThaiSan = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Lỗi lấy Hợp đồng nghỉ thai sản:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};

export const getNghiThaiSanByMaTK = async (MaTK) => {
  try {
    const response = await axios.get(`${API_URL}/${MaTK}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Lỗi lấy Hợp đồng nghỉ thai sản:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};

export const createNghiThaiSan = async (data) => {
  try {
    const res = await axios.post(API_URL, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Lỗi tạo nghỉ thai sản:", error);
    return { success: false, message: error?.response?.data?.error || "Lỗi kết nối server" };
  }
};

export const updateNghiThaiSan = async (id, data) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Lỗi cập nhật nghỉ thai sản:", error);
    return { success: false, message: error?.response?.data?.error || "Lỗi kết nối server" };
  }
};

export const deleteNghiThaiSan = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Lỗi xóa nghỉ thai sản:", error);
    return { success: false, message: error?.response?.data?.error || "Lỗi kết nối server" };
  }
};

export const uploadGiayThaiSan = async (file) => {
  const formData = new FormData();
  formData.append("giaythaisan", file);
  try {
    const res = await axios.post(`${API_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Lỗi upload giấy thai sản:", error);
    return { success: false, message: error?.response?.data?.error || "Lỗi upload giấy thai sản" };
  }
};
