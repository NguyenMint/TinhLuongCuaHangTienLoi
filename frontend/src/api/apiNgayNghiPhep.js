import axios from "axios";
export const xinNghiPhep = async (form) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/ngaynghiphep/xinNghiPhep`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response?.status === 404 || error.response?.status === 400) {
      return { success: false, message: error.response.data.message };
    }
    console.error("Lỗi tạo Ca làm:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const duyetDon = async (MaNNP) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/ngaynghiphep/duyetDon/${MaNNP}`,
      {TrangThai:"Đã duyệt"},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response?.status === 404 || error.response?.status === 400) {
      return { success: false, message: error.response.data.message };
    }
    console.error("Lỗi tạo Ca làm:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const tuChoiDon = async (MaNNP) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/ngaynghiphep/duyetDon/${MaNNP}`,
      {TrangThai:"Từ chối"},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response?.status === 404 || error.response?.status === 400) {
      return { success: false, message: error.response.data.message };
    }
    console.error("Lỗi tạo Ca làm:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const getDonXinNghiByNV = async (MaTK) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/ngaynghiphep/donxinnghiByNV/${MaTK}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy đơn xin nghĩ", error);
    return { message: "Lỗi kết nối đến server" };
  }
};
export const getDonXinNghi = async() => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/ngaynghiphep/donChoDuyet`,
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