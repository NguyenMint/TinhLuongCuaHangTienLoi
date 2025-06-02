import axios from "axios";
import { BASE_URL } from "./environments/environment";

export const fetchAllNhanVien = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/taikhoan/getAllNhanVien`);
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy user:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const fetchChiNhanh = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/chinhanh`);
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy Chi nhánh:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};

export const fetchCaLam = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/calam`);
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy Ca làm:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};

export const fetchDangKyCa = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/dangkyca`);
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy Ca làm:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};

export const searchEmployee = async (keyword) => {
  try {
    
    const response = await axios.get(`${BASE_URL}/taikhoan/search`, {
      params: { keyword }
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi tìm kiếm nhân viên:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};

// export const createDangKyCaByMaNS = async (MaNS) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/dangkyca/${MaNS}`);
//     return response.data;
//   } catch (error) {
//     console.error("Lỗi lấy Ca làm:", error);
//     return { success: false, message: "Lỗi kết nối đến server" };
//   }
// };

export const createCaLam = async (caLamData) => {
  try {
    const response = await axios.post(`${BASE_URL}/calam`, caLamData);
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response.status === 409) {
      return { success: false, message: "Tên ca làm đã tồn tại" };
    }
    console.error("Lỗi tạo Ca làm:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const updateCaLam = async (caLamData) => {
  try {
    const response = await axios.put(`${BASE_URL}/calam/${caLamData.MaCa}`, caLamData);
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
    const response = await axios.delete(`${BASE_URL}/calam/${MaCaLam}`);
    return { success: true, data: response.data.message };
  } catch (error) {
    if (error.response?.status === 404) {
      return { success: false, message: "Ca làm không tồn tại" };
    }
    console.error("Lỗi tạo Ca làm:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};