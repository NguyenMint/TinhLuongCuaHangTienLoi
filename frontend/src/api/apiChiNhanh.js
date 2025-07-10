import axios from "axios";
export const getChiNhanh = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/chinhanh`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy Chi nhánh:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
