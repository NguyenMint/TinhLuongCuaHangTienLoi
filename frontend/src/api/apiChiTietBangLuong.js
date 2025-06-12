import axios from "axios";
export const getByNhanVienAndNgay = async (MaTK, Ngay) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/chitietbangluong/getByNhanVienAndNgay?MaTK=${MaTK}&Ngay=${Ngay}`
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy Bảng lương:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
