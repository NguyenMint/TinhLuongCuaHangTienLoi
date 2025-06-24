import axios from "axios";

export const getAllBangLuong = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/bangluong`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy Bảng lương:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};

export const createBangLuong = async (formData) => {
  const { Thang, Nam } = formData;

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/bangluong/createAll`,
      { Thang, Nam }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy Bảng lương:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};

export const getKyLuong = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/bangluong/getKyLuong`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy Bảng lương:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const getBLByCN = async (macn) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/bangluong/getbl/${macn}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy Bảng lương:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const getBLTotal = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/bangluong/getbltotal`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy Bảng lương:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const getPLByKyLuong = async (kyLuong) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/bangluong/getpl/`,
      { kyLuong }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy Bảng lương:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const getPLByKyLuongCN = async (kyLuong, maCN) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/bangluong/getplbycn/`,
      { kyLuong, maCN }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy Bảng lương:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const deleteBangLuong = async (KyLuong) => {
  try {
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/bangluong/deleteKyLuong`,
      {
        headers: {
          // Authorization: `Bearer ${token}`,
        },
        data: { KyLuong: KyLuong },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response.status === 404) {
      return { success: false, message: error.response.data.message };
    }
    console.error("Lỗi lấy bảng lương:", error);
    return { message: "Lỗi kết nối đến server" };
  }
};
