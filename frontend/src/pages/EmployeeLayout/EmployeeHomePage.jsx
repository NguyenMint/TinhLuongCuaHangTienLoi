import { useEffect, useState } from "react";
import { UserIcon, AlertCircle } from "lucide-react";
import { fetchLLVByNhanVien } from "../../api/apiLichLamViec";
import { chamCongVao, chamCongRa, getTimeServer } from "../../api/apiChamCong";
import { formatDate, formatTime } from "../../utils/format";
import { fetchNhanVien } from "../../api/apiTaiKhoan";
import { getNghiThaiSanByMaTK } from "../../api/apiNghiThaiSan";
import { toast } from "react-toastify";

export function EmployeeHomePage() {
  const [shifts, setShifts] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [loading, setLoading] = useState(false);
  const [quyenLoiThaiSan, setQuyenLoiThaiSan] = useState(false);
  const NgayHienTai = new Date();
  const ngay = NgayHienTai.toISOString().slice(0, 10);

  const timeStr = NgayHienTai.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const gioHienTai = NgayHienTai.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const refeshInfo = async () => {
    try {
      const res = await fetchNhanVien(user.MaTK);
      setUser(res);
    } catch (error) {
      console.log("Lỗi: ", error);
    }
  };

  useEffect(() => {
    async function checkThaiSan() {
      if (!user?.MaTK) return;
      const res = await getNghiThaiSanByMaTK(user.MaTK);
      const today = new Date();
      const nts = res.data.find(nts => {
        if (nts.TrangThai == 1) {
          const start = new Date(nts.NgayBatDau);
          const end = new Date(nts.NgayKetThuc);
          return today >= start && today <= end;
        }
        return false;
      });
      setQuyenLoiThaiSan(!!nts);
    }
    checkThaiSan();
  }, []);
  useEffect(() => {
    getDKCByNhanVien();
  }, []);

  const getDKCByNhanVien = async () => {
    setLoading(true);
    try {
      const manv = user.MaTK;
      const response = await fetchLLVByNhanVien(manv, ngay);
      setShifts(response);
    } catch (error) {
      console.log("Lỗi lấy ca làm", error);
    }
    setLoading(false);
  };

  const ChamCongVao = async (MaLLV) => {
    try {
      const gioVao = gioHienTai;
      const response = await chamCongVao(ngay, gioVao, MaLLV, false);
      if (!response.success) {
        toast.error(response.message || "Chấm công thất bại");
      }
      getDKCByNhanVien();
    } catch (error) {
      console.log("Lỗi khi chấm công vào: ", error);
    }
  };

  const ChamCongRa = async (MaLLV) => {
    try {
      const gioRa = gioHienTai;
      const response = await chamCongRa(ngay, gioRa, MaLLV, false);
      if (!response.success) {
        toast.error(response.message || "Chấm công thất bại");
      }
      getDKCByNhanVien();
    } catch (error) {
      console.log("Lỗi khi chấm công ra: ", error);
    }
  };

  if (shifts === null || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span>Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="pt-16 px-4 mb-16">
      <div className="flex items-center gap-6 bg-white rounded-xl shadow p-6 mb-6">
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
          {user.Avatar ? (
            <img
              src={`${process.env.REACT_APP_BACKEND_URL}/${user.Avatar}`}
              alt="avatar"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <UserIcon className="w-12 h-12 text-gray-400" />
          )}
        </div>
        <div>
          <div className="font-bold text-2xl">{user.HoTen}</div>
          <div className="flex gap-4 mt-2 text-sm text-gray-600">
            <span>Điện thoại: {user.SoDienThoai}</span>
            <span>Email: {user.Email}</span>
            <span>Chi nhánh: {user.TenChiNhanh}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center mb-6">
        <div className="text-gray-500 text-base">{formatDate(NgayHienTai)}</div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-6xl font-extrabold tracking-widest">
            {timeStr}
          </span>
        </div>
      </div>

      {quyenLoiThaiSan && (
        <div className="flex items-center gap-2 bg-pink-100 border-l-4 border-pink-500 text-pink-800 px-4 py-3 rounded mb-6">
          <AlertCircle className="w-5 h-5" />
          Trong thời gian nghỉ thai sản, bạn được phép về sớm 30 phút mỗi ngày mà không bị trừ lương.
        </div>
      )}

      {shifts.length === 0 ? (
        <div className="flex items-center gap-2 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-6">
          <AlertCircle className="w-5 h-5" />
          Hiện tại không có ca làm việc để chấm công.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-4">
            Danh sách ca làm hôm nay
          </h2>
          <table className="w-full border rounded overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Tên ca</th>
                <th className="p-2 border">Thời gian</th>
                <th className="p-2 border">Trạng thái</th>
                <th className="p-2 border">Chấm công</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map((shift) => (
                <tr key={shift.id} className="text-center">
                  <td className="p-2 border">{shift.MaCaLam_ca_lam?.TenCa}</td>
                  <td className="p-2 border">
                    {formatTime(shift.MaCaLam_ca_lam?.ThoiGianBatDau)} -
                    {formatTime(shift.MaCaLam_ca_lam?.ThoiGianKetThuc)}
                  </td>
                  <td className="p-2 border">
                    {shift.cham_congs.length === 0 ? (
                      <span className="text-yellow-600 font-semibold">
                        Chưa chấm công
                      </span>
                    ) : (
                      <>
                        {shift.cham_congs[0].trangthai === "Hoàn thành" && (
                          <span className="text-green-600 font-semibold">
                            {shift.cham_congs[0].trangthai}
                          </span>
                        )}
                        {shift.cham_congs[0].trangthai === "Chờ duyệt" && (
                          <span className="text-yellow-600 font-semibold">
                            {shift.cham_congs[0].trangthai}
                          </span>
                        )}
                        {shift.cham_congs[0].trangthai === "Từ chối" && (
                          <span className="text-red-600 font-semibold">
                            {shift.cham_congs[0].trangthai}
                          </span>
                        )}
                      </>
                    )}
                  </td>
                  <td className="p-2 border">
                    {shift.cham_congs.length === 0 ? (
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold"
                        onClick={() => {
                          ChamCongVao(shift.MaLLV);
                        }}
                      >
                        Chấm công vào ca
                      </button>
                    ) : (
                      <div>
                        <div className="mb-2">
                          <span className="block text-sm text-gray-700">
                            Giờ vào:{" "}
                            <span className="font-semibold">
                              {shift.cham_congs[0].GioVao}
                            </span>
                          </span>
                          <span className="block text-sm text-gray-700">
                            Đi trễ:{" "}
                            <span className="font-semibold">
                              {shift.cham_congs[0].DiTre} phút
                            </span>
                          </span>
                          {shift.cham_congs[0].GioRa && (
                            <>
                              <span className="block text-sm text-gray-700">
                                Giờ ra:{" "}
                                <span className="font-semibold">
                                  {shift.cham_congs[0].GioRa}
                                </span>
                              </span>
                              <span className="block text-sm text-gray-700">
                                Về sớm:{" "}
                                <span className="font-semibold">
                                  {shift.cham_congs[0].VeSom} phút
                                </span>
                              </span>
                            </>
                          )}
                        </div>
                        {!shift.cham_congs[0].GioRa ? (
                          <button
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold"
                            onClick={() => {
                              ChamCongRa(shift.MaLLV);
                            }}
                          >
                            Chấm công ra ca
                          </button>
                        ) : (
                          <span className="text-green-600 font-bold text-xl">
                            ✓
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
