import React, { useState, useEffect } from "react";
import { Calendar, DollarSign, Clock, TrendingUp, Eye } from "lucide-react";
import { getByNhanVienAndNgay } from "../../api/apiChiTietBangLuong";
import { getDetailCaLam } from "../../api/apiCaLam";
export function EmployeeProfilePage() {
  // Mock user data (thay thế localStorage trong môi trường thực tế)
  const user = JSON.parse(localStorage.getItem("user"));

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSalaryData = async (date) => {
    setLoading(true);
    try {
      // Thay thế URL này bằng API endpoint thực tế của bạn
      const response = await getByNhanVienAndNgay(user.MaTK, date);
      setSalaryData(response);
      console.log(response);
    } catch (error) {
      console.error("Error fetching salary data:", error);
      setSalaryData(null);
    }
    setLoading(false);
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatTime = (timeString) => {
    return timeString ? timeString.substring(0, 5) : "--:--";
  };


  useEffect(() => {
    fetchSalaryData(selectedDate);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      {/* Employee Profile Section */}
      <div className="bg-white rounded-xl shadow-sm py-8 px-6 mb-6">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden">
            <img
              src={`${process.env.REACT_APP_BACKEND_URL}/${user.Avatar}`}
              alt="avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          </div>
          <div>
            <div className="font-bold text-2xl mb-1 text-gray-800">
              {user.HoTen}
            </div>
            <div className="text-gray-500 text-sm">{user.Email}</div>
            <div className="text-gray-600 text-sm mt-1">
              <span className="mr-4">
                <b>Giới tính:</b> {user.GioiTinh ? "Nam" : "Nữ"}
              </span>
              <span>
                <b>Ngày sinh:</b> {user.NgaySinh}
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="mb-2">
              <b>Địa chỉ:</b> {user.DiaChi}
            </div>
            <div className="mb-2">
              <b>Số điện thoại:</b> {user.SoDienThoai}
            </div>
            <div className="mb-2">
              <b>CCCD:</b> {user.CCCD}
            </div>
            <div className="mb-2">
              <b>Loại nhân viên:</b> {user.LoaiNV}
            </div>
          </div>
          <div>
            <div className="mb-2">
              <b>Ngân hàng:</b> {user.TenNganHang}
            </div>
            <div className="mb-2">
              <b>Số tài khoản:</b> {user.STK}
            </div>
            <div className="mb-2">
              <b>Chi nhánh:</b> {user.TenChiNhanh}
            </div>
            <div className="mb-2">
              <b>Địa chỉ chi nhánh:</b> {user.DiaChiCN}
            </div>
          </div>
        </div>
      </div>

      {/* Salary Information Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-600" />
            Thông tin lương theo ngày
          </h2>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                const date = e.target.value;
                setSelectedDate(date); 
                fetchSalaryData(date); 
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
          </div>
        ) : salaryData ? (
          <div>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-lg text-blue-800 mb-2">
                Lương ngày {formatDate(selectedDate)}
              </h3>
              <div className="text-sm text-blue-600">
                Tổng giờ làm việc:{" "}
                <span className="font-medium">
                  {salaryData.chiTietBangLuong?.GioLamViecTrongNgay || 0} giờ
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">
                      Lương ngày
                    </p>
                    <p className="text-lg font-bold text-green-800">
                      {formatCurrency(
                        parseFloat(
                          salaryData.chiTietBangLuong?.TienLuongNgay || 0
                        )
                      )}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Phụ cấp</p>
                    <p className="text-lg font-bold text-blue-800">
                      {formatCurrency(
                        parseFloat(salaryData.chiTietBangLuong?.TienPhuCap || 0)
                      )}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600 font-medium">
                      Tiền phạt
                    </p>
                    <p className="text-lg font-bold text-red-800">
                      {formatCurrency(
                        parseFloat(salaryData.chiTietBangLuong?.TienPhat || 0)
                      )}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">
                Chi tiết lương
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Lương ngày:</span>
                  <span className="font-medium">
                    {formatCurrency(
                      parseFloat(
                        salaryData.chiTietBangLuong?.TienLuongNgay || 0
                      )
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phụ cấp:</span>
                  <span className="font-medium text-blue-600">
                    +
                    {formatCurrency(
                      parseFloat(salaryData.chiTietBangLuong?.TienPhuCap || 0)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tiền phạt:</span>
                  <span className="font-medium text-red-600">
                    -
                    {formatCurrency(
                      parseFloat(salaryData.chiTietBangLuong?.TienPhat || 0)
                    )}
                  </span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng thu nhập:</span>
                  <span className="text-green-600">
                    {formatCurrency(
                      parseFloat(salaryData.chiTietBangLuong?.tongtien || 0)
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Thông tin chấm công */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">
                Thông tin chấm công
              </h4>
              <div className="space-y-4">
                {salaryData.chiTietBangLuong?.cham_congs?.map(
                  (chamCong, index) => (
                    <div
                      key={chamCong.MaChamCong}
                      className="bg-white rounded-lg p-4 border"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {chamCong.MaDKC_dang_ky_ca.MaCaLam_ca_lam.TenCa}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              chamCong.trangthai === "Hoàn thành"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {chamCong.trangthai}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {chamCong.NgayLe && (
                            <span className="text-red-500">Ngày lễ</span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Giờ vào:</span>
                          <div className="font-medium">
                            {formatTime(chamCong.GioVao)}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Giờ ra:</span>
                          <div className="font-medium">
                            {formatTime(chamCong.GioRa)}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Đi trễ:</span>
                          <div className="font-medium text-red-600">
                            {chamCong.DiTre} phút
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Về sớm:</span>
                          <div className="font-medium text-red-600">
                            {chamCong.VeSom} phút
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Khen thưởng - Kỷ luật */}
            {salaryData.khenThuongKyLuats &&
              salaryData.khenThuongKyLuats.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Khen thưởng - Kỷ luật
                  </h4>
                  <div className="space-y-3">
                    {salaryData.khenThuongKyLuats.map((item, index) => (
                      <div
                        key={item.MaKTKL}
                        className={`p-3 rounded-lg border-l-4 ${
                          item.ThuongPhat
                            ? "bg-green-50 border-green-400"
                            : "bg-red-50 border-red-400"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div
                              className={`font-medium ${
                                item.ThuongPhat
                                  ? "text-green-800"
                                  : "text-red-800"
                              }`}
                            >
                              {item.ThuongPhat ? "Khen thưởng" : "Kỷ luật"}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              Lý do: {item.LyDo}
                            </div>
                            {item.DuocMienThue && (
                              <div className="text-xs text-blue-600 mt-1">
                                Được miễn thuế
                              </div>
                            )}
                          </div>
                          <div
                            className={`font-bold ${
                              item.ThuongPhat
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {item.ThuongPhat ? "+" : "-"}
                            {formatCurrency(parseFloat(item.MucThuongPhat))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              Không có dữ liệu lương cho ngày đã chọn
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
