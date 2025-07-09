import axios from "axios";
export const fetchLichLamViec = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/lichlamviec`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy Ca làm:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const fetchLLVDaDangKy = async () => {
  try {
    const response = await axios.get( `${process.env.REACT_APP_BACKEND_URL}/lichlamviec/getAllDaDangKy`);
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy Ca làm:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
}
export const fetchLLVByNhanVien = async (MaNV, NgayLam) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/lichlamviec/getCaLamByNhanVien/${MaNV}?NgayLam=${NgayLam}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy ĐK Ca theo nhân viên:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};

export const getAllLLVByNhanVien = async (MaTK) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/lichlamviec/getAllCaLamByNhanVien/${MaTK}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy lịch làm việc theo nhân viên:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
}

export const dangKyCa = async (formData)=>{
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/lichlamviec/dangKyCa`,
      formData
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Lỗi xóa ĐK Ca:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
}
export const huyDangKyCa = async (MaLLV) => {
  try {
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/lichlamviec/huyDangKy/${MaLLV}`
    );
    return { success: true, data: response.data.message };
  } catch (error) {
    if (error.response.status === 404 || error.response.status === 400) {
      return { success: false, message: error.response.data.message };
    } 
    console.error("Lỗi xóa ĐK Ca:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const deleteLichLamViec = async (MaLLV) => {
  try {
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/lichlamviec/${MaLLV}`
    );
    return { success: true, data: response.data.message };
  } catch (error) {
    if (error.response?.status === 404) {
      return { success: false, message: "Đăng ký ca làm không tồn tại" };
    } else if (error.response.status === 400) {
      return {
        success: false,
        message: "Không thể xóa đăng ký ca làm khi đã có chấm công",
      };
    }
    console.error("Lỗi xóa ĐK Ca:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const updateLLV = async (MaLLV, status) => {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/lichlamviec`,
      { MaLLV, status }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi cập nhật đăng ký ca:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const createLLV = async (formData) => {
  try {
    const { MaTK, NgayLam, MaCaLam, TrangThai } = formData;
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/lichlamviec`,
      { MaTK, NgayLam, MaCaLam, TrangThai }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi tạo lịch làm việc:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
