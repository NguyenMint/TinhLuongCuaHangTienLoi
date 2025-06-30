import axios from "axios";
export const getNguoiPhuThuocByNV = async (MaTK) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/nguoiphuthuoc/${MaTK}`,
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
  export const createNguoiPhuThuoc = async (form) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/nguoiphuthuoc`,
        form,
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
      console.error("Lỗi thêm người phụ thuộc:", error);
      return { success: false, message: "Lỗi kết nối đến server" };
    }
  };
  export const updateNguoiPhuThuoc = async (form) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/nguoiphuthuoc/${form.MaNPT}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      if (error.response.status === 409 || error.response.status===404) {
        return { success: false, message: error.response.data.message };
      }
      console.error("Lỗi thêm người phụ thuộc:", error);
      return { success: false, message: "Lỗi kết nối đến server" };
    }
  };
  export const deleteNguoiPhuThuoc = async (MaNPT) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/nguoiphuthuoc/${MaNPT}`,
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