import axios from 'axios';
export const getAllThangLuong = async () =>{
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/thangluong`);
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy ĐK Ca theo nhân viên:", error);
      return { success: false, message: "Lỗi kết nối đến server" };
    }
}
export const getAllThangLuongFullTime = async () =>{
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/thangluong/fulltime`);
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy ĐK Ca theo nhân viên:", error);
      return { success: false, message: "Lỗi kết nối đến server" };
    }
}
export const createThangLuong = async (thangLuongData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/thangluong`,
      thangLuongData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    if(error.response.status === 409) {
      return { success: false, message: "Bậc lương đã tồn tại" };
    }
    console.error("Lỗi tạo Thang lương:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const updateThangLuong = async (thangLuongData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/thangluong/${thangLuongData.MaThangLuong}`,
      thangLuongData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    if(error.response.status === 409) {
      return { success: false, message: "Bậc lương đã tồn tại" };
    }else if(error.response.status === 404) {
      return { success: false, message: "Thang lương không tồn tại" };
    }
    console.error("Lỗi tạo Thang lương:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const deleteThangLuong = async (MaThangLuong) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/thangluong/${MaThangLuong}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: response.data.message };
  } catch (error) {
    if (error.response?.status === 404) {
      return { success: false, message: "Thang lương không tồn tại" };
    }
    console.error("Lỗi tạo Ca làm:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};