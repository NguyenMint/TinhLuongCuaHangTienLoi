import axios from "axios";
export const chamCongVao = async (NgayChamCong, GioVao, MaDKC, NgayLe) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/chamcong`, {
      NgayChamCong,
      GioVao,
      MaDKC,
      NgayLe
    });
    return { success: true, data: response.data };
  } catch (error) {
    if(error.response.status === 401){
        return { success: false, message: "Không tồn tại lịch đăng ký ca này" };
    }
    console.error("Lỗi tạo Ca làm:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const chamCongRa = async (NgayChamCong, GioRa, MaDKC, NgayLe) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/chamcong`, {
      NgayChamCong,
      GioRa,
      MaDKC,
      NgayLe
    });
    return { success: true, data: response.data };
  } catch (error) {
    if(error.response.status === 401){
        return { success: false, message: "Không tồn tại lịch đăng ký ca này" };
    }
    console.error("Lỗi tạo Ca làm:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};