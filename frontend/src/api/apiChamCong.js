import axios from "axios";
export const chamCongVao = async (NgayChamCong, GioVao, MaLLV, NgayLe) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/chamcong`,
      {
        NgayChamCong,
        GioVao,
        MaLLV,
        NgayLe,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response.status === 401) {
      return { success: false, message: "Không tồn tại lịch đăng ký ca này" };
    }
    console.error("Lỗi tạo Ca làm:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const chamCongRa = async (NgayChamCong, GioRa, MaLLV, NgayLe) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/chamcong`,
      {
        NgayChamCong,
        GioRa,
        MaLLV,
        NgayLe,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response.status === 401) {
      return { success: false, message: "Không tồn tại lịch đăng ký ca này" };
    }
    console.error("Lỗi tạo Ca làm:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const chamCong = async (NgayChamCong, GioVao, GioRa, MaLLV, NgayLe) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/chamcong`,
      {
        NgayChamCong,
        GioRa,
        GioVao,
        MaLLV,
        NgayLe,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response.status === 401) {
      return { success: false, message: "Không tồn tại lịch đăng ký ca này" };
    }
    console.error("Lỗi tạo Ca làm:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};
export const update_chamcong = async (
  GioVao,
  GioRa,
  DiTre,
  VeSom,
  MaChamCong,
  NgayLam,
  MaLLV
) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/chamcong/update`,
      {
        GioVao,
        GioRa,
        DiTre,
        VeSom,
        MaChamCong,
        NgayLam,
        MaLLV,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response.status === 401) {
      return { success: false, message: "Không tồn tại lịch đăng ký ca này" };
    }
    console.error("Lỗi tạo Ca làm:", error);
    return { success: false, message: "Lỗi kết nối đến server" };
  }
};

export const getTimeServer = async () => {
  try {
    const response = await axios.get(
      "https://timeapi.io/api/time/current/zone?timeZone=Asia%2FHo_Chi_Minh"
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy thời gian:", error);
    return { message: "Lỗi kết nối đến server" };
  }
};
