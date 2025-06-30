import React, { useState } from "react";
import { formatCurrency } from "../../utils/format";
import { X, ChevronDown, ChevronUp } from "lucide-react";

export const PhieuLuongsTab = ({ phieuLuong }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [detailData, setDetailData] = useState([]);
  const [expandedDetails, setExpandedDetails] = useState({});

  // Hàm mở modal và lấy dữ liệu chi tiết
  const openDetailModal = async (employee) => {
    setShowModal(true);
    setSelectedEmployee(employee);
  };

  // Hàm đóng modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
    setDetailData([]);
    setExpandedDetails({});
  };

  const toggleDetailExpansion = (detailIndex) => {
    console.log("prev:", expandedDetails);
    console.log("prev[detailIndex]:", expandedDetails[detailIndex]);
    console.log("!prev[detailIndex]:", !expandedDetails[detailIndex]);

    setExpandedDetails((prev) => ({
      ...prev,
      [detailIndex]: !prev[detailIndex],
    }));
  };

  return (
    <div className="text-center">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Mã NV</th>
            <th className="border border-gray-300 p-2">Tên NV</th>
            <th className="border border-gray-300 p-2">Số giờ làm việc</th>
            <th className="border border-gray-300 p-2">Lương tháng</th>
            <th className="border border-gray-300 p-2">Phụ Cấp</th>
            <th className="border border-gray-300 p-2">Thưởng</th>
            <th className="border border-gray-300 p-2">Phạt</th>
            <th className="border border-gray-300 p-2">Tổng Lương</th>
            <th className="border border-gray-300 p-2">Thuế</th>
            <th className="border border-gray-300 p-2">Lương Thực Nhận</th>
          </tr>
        </thead>
        <tbody>
          {phieuLuong.map((employee) => (
            <tr
              className="cursor-pointer hover:text-gray-500"
              key={employee.MaBangLuong}
              onClick={() => openDetailModal(employee)}
            >
              <td className="border border-gray-300 p-2 text-center">
                {employee.MaNhanVien}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                {employee.HoTen}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                {employee.TongGioLamViec} giờ
              </td>
              <td className="border border-gray-300 p-2 text-center">
                {formatCurrency(employee.LuongThang)}
              </td>
              <td className="border border-gray-300 p-2 text-right">
                {formatCurrency(employee.TongPhuCap)}
              </td>
              <td className="border border-gray-300 p-2 text-right">
                {formatCurrency(employee.TongThuong)}
              </td>
              <td className="border border-gray-300 p-2 text-right">
                {formatCurrency(employee.TongPhat)}
              </td>
              <td className="border border-gray-300 p-2 text-right">
                {formatCurrency(employee.TongLuong)}
              </td>
              <td className="border border-gray-300 p-2 text-right">
                {formatCurrency(employee.ThuePhaiDong)}
              </td>
              <td className="border border-gray-300 p-2 text-right">
                {formatCurrency(employee.LuongThucNhan)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-3/4 max-h-[80vh] overflow-y-auto">
            <div className="flex border-b items-center">
              <div className="flex-1 flex justify-center">
                <h2 className="text-xl font-bold mb-4 text-center">
                  Chi tiết phiếu lương - {selectedEmployee.HoTen} (
                  {selectedEmployee.MaNhanVien})
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X className="h-6 w-6 mr-6" />
              </button>
            </div>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">Ngày</th>
                  <th className="border border-gray-300 p-2">Giờ làm việc</th>
                  <th className="border border-gray-300 p-2">Lương/giờ</th>
                  <th className="border border-gray-300 p-2">Hệ số lương</th>
                  <th className="border border-gray-300 p-2">Loại ca</th>
                  <th className="border border-gray-300 p-2">Loại ngày</th>
                  <th className="border border-gray-300 p-2">Tiền lương ca</th>
                  <th className="border border-gray-300 p-2">Thưởng phụ cấp</th>
                  <th className="border border-gray-300 p-2">Phạt</th>
                  <th className="border border-gray-300 p-2">Tổng tiền</th>
                </tr>
              </thead>
              <tbody>
                {selectedEmployee.details.length > 0 ? (
                  selectedEmployee.details.map((detail, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td className="border border-gray-300 p-2 text-center">
                          {detail.Ngay}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {detail.GioLamViec} giờ
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {formatCurrency(detail.LuongMotGio)}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                          {detail.HeSoLuong}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                          {detail.isCaDem ? "Ca đêm" : "Ca thường"}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                          {detail.isNgayLe
                            ? "Ngày lễ"
                            : detail.isCuoiTuan
                            ? "Cuối tuần"
                            : "Ngày thường"}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                          {formatCurrency(detail.TienLuongCa)}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                          <div className="flex items-center justify-between">
                            <span>{formatCurrency(detail.TienPhuCap)}</span>
                            {detail.detailsThuongPhat.length > 0 &&
                              detail.TienPhuCap > 0 && (
                                <button
                                  onClick={(e) => {
                                    
                                    toggleDetailExpansion(index);
                                  }}
                                  className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                  {expandedDetails[index] ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                          </div>
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                          <div className="flex items-center justify-between">
                            <span>{formatCurrency(detail.TienPhat)}</span>
                            {detail.detailsThuongPhat.length > 0 &&
                              detail.TienPhat > 0 && (
                                <button
                                  onClick={(e) => {
                                    
                                    toggleDetailExpansion(index);
                                  }}
                                  className="ml-2 text-red-600 hover:text-red-800"
                                >
                                  {expandedDetails[index] ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                          </div>
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                          {formatCurrency(detail.tongtien)}
                        </td>
                      </tr>
                      {expandedDetails[index] &&
                        detail.detailsThuongPhat.length > 0 && (
                          <tr>
                            <td
                              colSpan="10"
                              className="border border-gray-300 p-0"
                            >
                              <div className="bg-gray-50 p-3 border-t border-gray-200">
                                <h4 className="font-semibold text-sm mb-2 text-gray-700">
                                  Chi tiết thưởng/phạt ngày {detail.Ngay}:
                                </h4>
                                <div className="space-y-2">
                                  {detail.detailsThuongPhat.map(
                                    (ktkl, ktklIndex) => (
                                      <div
                                        key={ktklIndex}
                                        className={`p-2 rounded text-sm ${
                                          ktkl.ThuongPhat === true
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        <div className="flex justify-between items-center">
                                          <span className="font-medium">
                                            {ktkl.ThuongPhat
                                              ? "Thưởng"
                                              : "Phạt"}
                                            : {ktkl.LyDo}
                                          </span>
                                          <span className="font-bold">
                                            {formatCurrency(ktkl.MucThuongPhat)}
                                          </span>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10">Không có dữ liệu chấm công</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={closeModal}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhieuLuongsTab;
