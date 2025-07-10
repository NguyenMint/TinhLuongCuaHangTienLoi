import axios from "axios";

export const getAllBangLuong = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/bangluong`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
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
      { Thang, Nam },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
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
      `${process.env.REACT_APP_BACKEND_URL}/bangluong/getKyLuong`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
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
      `${process.env.REACT_APP_BACKEND_URL}/bangluong/getbl/${macn}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
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
      `${process.env.REACT_APP_BACKEND_URL}/bangluong/getbltotal`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
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
      { kyLuong },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
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
      { kyLuong, maCN },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
