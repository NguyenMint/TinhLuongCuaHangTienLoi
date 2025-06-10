import axios from 'axios';
export const getHeSoPhuCap = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/hesophucap`);
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy hệ số phụ cấp:", error);
    return { message: "Lỗi kết nối đến server" };
  }
};
export const createHeSoPhuCap = async (phuCapData) =>{
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/hesophucap`,
      phuCapData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    if(error.response.status===409){
      return {success:false, message: error.response.data.message}
    }
    console.error("Lỗi lấy hệ số phụ cấp:", error);
    return { message: "Lỗi kết nối đến server" };
  }
}
export const updateHeSoPhuCap = async (phuCapData) =>{
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/hesophucap/${phuCapData.MaHSN}`,
      phuCapData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    if(error.response.status===404){
      return {success:false, message: error.response.data.message}
    }
    console.error("Lỗi lấy hệ số phụ cấp:", error);
    return { message: "Lỗi kết nối đến server" };
  }
}
export const deleteHeSoPhuCap = async (MaHSN) =>{
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/hesophucap/${MaHSN}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    if(error.response.status===404){
      return {success:false, message: error.response.data.message}
    }
    console.error("Lỗi lấy hệ số phụ cấp:", error);
    return { message: "Lỗi kết nối đến server" };
  }
}