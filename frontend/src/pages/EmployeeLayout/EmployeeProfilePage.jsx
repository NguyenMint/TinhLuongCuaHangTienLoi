import React, { useState, useEffect } from "react";
import { Calendar, DollarSign, Clock, TrendingUp, Eye } from "lucide-react";
import { getByNhanVienAndNgay } from "../../api/apiChiTietBangLuong";
import { formatCurrency, formatDate, formatTime } from "../../utils/format";
import { fetchNhanVien } from "../../api/apiTaiKhoan";
export function EmployeeProfilePage() {
  const [user,setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchSalaryData = async (date) => {
    setLoading(true);
    try {
      const response = await getByNhanVienAndNgay(user.MaTK, date);
      setSalaryData(response);
    } catch (error) {
      console.error("Error fetching salary data:", error);
      setSalaryData(null);
    }
    setLoading(false);
  };
  const refeshInfo = async () => {
    try {
      const res = await fetchNhanVien(user.MaTK);
      setUser(res);
    } catch (error) {
      console.log("Lỗi: ", error);
    }
  };
  useEffect(()=>{
    refeshInfo();
  },[]);
  const calculateDailySummary = (chiTietBangLuong) => {
    return chiTietBangLuong.reduce(
      (acc, item) => {
        return {
          tongGioLam: acc.tongGioLam + item.GioLamViec,
          tongLuong: acc.tongLuong + parseFloat(item.TienLuongCa),
          tongPhuCap: acc.tongPhuCap + parseFloat(item.TienPhuCap),
          tongPhat: acc.tongPhat + parseFloat(item.TienPhat),
          tongThu: acc.tongThu + parseFloat(item.tongtien),
        };
      },
      {
        tongGioLam: 0,
        tongLuong: 0,
        tongPhuCap: 0,
        tongPhat: 0,
        tongThu: 0,
      }
    );
  };

  useEffect(() => {
    fetchSalaryData(selectedDate);
  }, [selectedDate]);

  return (
    <div className="bg-gray-50 min-h-screen p-4 mt-5">
      <div className="bg-white rounded-xl shadow-sm py-8 px-6 mb-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="w-28 h-28 rounded-full from-blue-100 to-blue-200 overflow-hidden">
              <img
                src={`${process.env.REACT_APP_BACKEND_URL}/${user.Avatar}`}
                alt="avatar"
                className="w-full h-full object-cover"
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

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
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
        ) : salaryData?.chiTietBangLuong?.length > 0 ? (
          <div>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-lg text-blue-800 mb-2">
                Lương ngày {formatDate(selectedDate)}
              </h3>
              <div className="text-sm text-blue-600">
                Tổng giờ làm việc:{" "}
                <span className="font-medium">
                  {
                    calculateDailySummary(salaryData.chiTietBangLuong)
                      .tongGioLam
                  }{" "}
                  giờ
                </span>
              </div>
            </div>
            {/* Chi tiết từng ca làm */}
            <div className="space-y-4">
              {salaryData.chiTietBangLuong.map((chiTiet, index) => (
                <div
                  key={chiTiet.MaCTBL}
                  className="bg-white rounded-lg shadow p-4"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-lg">
                      {
                        chiTiet.cham_congs[0].MaLLV_lich_lam_viec.MaCaLam_ca_lam
                          .TenCa
                      }
                    </h4>
                    <div className="flex gap-2">
                      {chiTiet.isCaDem && (
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                          Ca đêm
                        </span>
                      )}
                      {chiTiet.isCuoiTuan && (
                        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                          Cuối tuần
                        </span>
                      )}
                      {chiTiet.isNgayLe && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                          Ngày lễ
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-gray-600 text-sm">Giờ làm:</span>
                      <p className="font-medium">{chiTiet.GioLamViec} giờ</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">
                        Hệ số lương:
                      </span>
                      <p className="font-medium">{chiTiet.HeSoLuong}x</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Lương/giờ:</span>
                      <p className="font-medium">
                        {formatCurrency(parseFloat(chiTiet.LuongMotGio))}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">
                        Tiền lương ca:
                      </span>
                      <p className="font-medium text-green-600">
                        {formatCurrency(parseFloat(chiTiet.TienLuongCa))}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <span className="text-gray-600 text-sm">Giờ vào:</span>
                        <p className="font-medium">
                          {formatTime(chiTiet.cham_congs[0].GioVao)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Đi trễ:</span>
                        <p className="font-medium text-red-600">
                          {chiTiet.cham_congs[0].DiTre} phút
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Giờ ra:</span>
                        <p className="font-medium">
                          {formatTime(chiTiet.cham_congs[0].GioRa)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Về sớm:</span>
                        <p className="font-medium text-red-600">
                          {chiTiet.cham_congs[0].VeSom} phút
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Chi tiết khen thưởng/kỷ luật */}
                  {chiTiet.cham_congs[0].MaLLV_lich_lam_viec
                    .khen_thuong_ky_luats.length > 0 && (
                    <div className="border-t mt-4 pt-4">
                      <div className="font-semibold mb-2">
                        Chi tiết phạt/thưởng:
                      </div>
                      <ul className="space-y-1">
                        {chiTiet.cham_congs[0].MaLLV_lich_lam_viec.khen_thuong_ky_luats.map(
                          (ktkl) => (
                            <li
                              key={ktkl.MaKTKL}
                              className="flex items-center gap-2 text-sm"
                            >
                              <span
                                className={
                                  ktkl.ThuongPhat
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {ktkl.ThuongPhat ? "+ " : "- "}
                                {formatCurrency(parseFloat(ktkl.MucThuongPhat))}
                              </span>
                              <span>
                                {ktkl.ThuongPhat ? "Thưởng" : "Phạt"}:{" "}
                                {ktkl.LyDo}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {(parseFloat(chiTiet.TienPhuCap) > 0 ||
                    parseFloat(chiTiet.TienPhat) > 0) && (
                    <div className="border-t mt-4 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        {parseFloat(chiTiet.TienPhuCap) > 0 && (
                          <div>
                            <span className="text-gray-600 text-sm">
                              Phụ cấp:
                            </span>
                            <p className="font-medium text-blue-600">
                              +{formatCurrency(parseFloat(chiTiet.TienPhuCap))}
                            </p>
                          </div>
                        )}
                        {parseFloat(chiTiet.TienPhat) > 0 && (
                          <div>
                            <span className="text-gray-600 text-sm">
                              Tổng phạt:
                            </span>
                            <p className="font-medium text-red-600">
                              -{formatCurrency(parseFloat(chiTiet.TienPhat))}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="border-t mt-4 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Tổng thu:</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(parseFloat(chiTiet.tongtien))}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">
                      Tổng lương ngày
                    </p>
                    <p className="text-lg font-bold text-green-800">
                      {formatCurrency(
                        calculateDailySummary(salaryData.chiTietBangLuong)
                          .tongLuong
                      )}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">
                      Tổng phụ cấp
                    </p>
                    <p className="text-lg font-bold text-blue-800">
                      {formatCurrency(
                        calculateDailySummary(salaryData.chiTietBangLuong)
                          .tongPhuCap
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
                      Tổng phạt
                    </p>
                    <p className="text-lg font-bold text-red-800">
                      {formatCurrency(
                        calculateDailySummary(salaryData.chiTietBangLuong)
                          .tongPhat
                      )}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </div>
            {/* Tổng cộng cuối ngày */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Tổng thu nhập trong ngày:</span>
                <span className="text-green-600">
                  {formatCurrency(
                    calculateDailySummary(salaryData.chiTietBangLuong).tongThu
                  )}
                </span>
              </div>
            </div>
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
