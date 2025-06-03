import { useEffect, useState } from "react";
import { UserIcon, AlertCircle } from "lucide-react";
import { fetchDKCByNhanVien } from "../../api/apiDangKyCa";
export function EmployeeHomePage() {
  // Dữ liệu mẫu
  const [shifts, setShifts] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getDKCByNhanVien();
  }, []);
  const now = new Date();
  const timeStr = now.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const dateStr = now.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const getDKCByNhanVien = async () => {
    const manv = user.MaTK;
    const ngay = now.toISOString().split("T")[0]; // Lấy ngày hiện tại theo định dạng YYYY-MM-DD
    const response = await fetchDKCByNhanVien(manv, ngay);
    setShifts(response);
  };
  if (shifts === null) {
    return (
      <div className="flex justify-center items-center h-64">
        <span>Đang tải dữ liệu...</span>
      </div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Thông tin nhân viên */}
      <div className="flex items-center gap-6 bg-white rounded-xl shadow p-6 mb-6">
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <UserIcon className="w-12 h-12 text-gray-400" />
          )}
        </div>
        <div>
          <div className="font-bold text-2xl">{user.name}</div>
          <div className="text-gray-500 text-sm">{user.code}</div>
          <div className="flex gap-4 mt-2 text-sm text-gray-600">
            <span>Điện thoại: {user.SoDienThoai}</span>
            <span>Email: {user.Email}</span>
            <span>Chi nhánh: {user.TenChiNhanh}</span>
          </div>
        </div>
      </div>

      {/* Ngày giờ */}
      <div className="flex flex-col items-center mb-6">
        <div className="text-gray-500 text-base">
          {dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-6xl font-extrabold tracking-widest">
            {timeStr.split(":")[0]}
          </span>
          <span className="text-6xl font-extrabold">:</span>
          <span className="text-6xl font-extrabold tracking-widest">
            {timeStr.split(":")[1]}
          </span>
        </div>
      </div>

      {/* Bảng ca làm hoặc cảnh báo */}
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
                <th className="p-2 border">Mô tả</th>
                <th className="p-2 border">Trạng thái</th>
                <th className="p-2 border">Chấm công</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map((shift) => (
                <tr key={shift.id} className="text-center">
                  <td className="p-2 border">{shift.MaCaLam_ca_lam?.TenCa}</td>
                  <td className="p-2 border">
                    {shift.MaCaLam_ca_lam?.ThoiGianBatDau} -{" "}
                    {shift.MaCaLam_ca_lam?.ThoiGianKetThuc}
                  </td>
                  <td className="p-2 border">{shift.MaCaLam_ca_lam?.MoTa}</td>
                  <td className="p-2 border">
                    {shift.cham_congs.length > 0 ? (
                      <span className="text-green-600 font-semibold">
                        Đã chấm công
                      </span>
                    ) : (
                      <span className="text-yellow-600 font-semibold">
                        Chưa chấm công
                      </span>
                    )}
                  </td>
                  <td className="p-2 border">
                    {shift.DaChamCong ? (
                      <span className="text-green-600 font-bold text-xl">
                        ✓
                      </span>
                    ) : (
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold"
                        onClick={() => {}}
                      >
                        Chấm công vào ca
                      </button>
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
