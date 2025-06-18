import React, { useState } from "react";
import { CalendarIcon, DollarSignIcon, CoinsIcon, X } from "lucide-react";
import {
  updateNgungLamViec,
  updateTiepTucLamViec,
} from "../../api/apiTaiKhoan";

export const EmployeeDetail = ({
  employee,
  activeTab,
  setActiveTab,
  onEmployeeStatusChange,
  setShowModalUpdate,
  showDetail,
  setShowDetail,
}) => {
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");

  const handleDungLam = async (MaTK) => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn cho nhân viên này ngừng làm việc?"
    );
    if (!confirmed) return;
    try {
      await updateNgungLamViec(MaTK);
      onEmployeeStatusChange();
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi: " + (error.message || "Lỗi không xác định"));
    }
  };

  const handleTiepTucLam = async (MaTK) => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn cho nhân viên này đã trở lại làm việc?"
    );
    if (!confirmed) return;
    try {
      await updateTiepTucLamViec(MaTK);
      onEmployeeStatusChange();
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi: " + (error.message || "Lỗi không xác định"));
    }
  };

  const handleGetConfirmationCode = () => {
    // Generate a random 6-digit confirmation code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setConfirmationCode(code);
    setShowConfirmationPopup(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(confirmationCode);
    alert("Mã xác nhận đã được sao chép!");
  };

  const closeConfirmationPopup = () => {
    setShowConfirmationPopup(false);
    setConfirmationCode("");
  };

  const closeDetailModal = () => {
    setShowDetail(false);
    setActiveTab("info"); // Reset to default tab when closing
  };

  if (!showDetail) return null;

  return (
    <>
      {/* Main Modal Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              Chi tiết nhân viên: {employee?.HoTen}
            </h2>
            <button
              onClick={closeDetailModal}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-0">
            {/* Tabs */}
            <div className="flex border-b">
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "info"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("info")}
              >
                <div className="flex items-center">
                  <div className="h-4 w-4 mr-2" />
                  <span>Thông tin</span>
                </div>
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "salary"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("salary")}
              >
                <div className="flex items-center">
                  <DollarSignIcon className="h-4 w-4 mr-2" />
                  <span>Thiết lập lương</span>
                </div>
              </button>
            </div>

            {/* Tab content */}
            <div className="p-4">
              {activeTab === "info" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <div className="bg-gray-100 p-4 flex items-center justify-center h-52 rounded-lg">
                      <div className="h-40 w-40 rounded-full bg-gray-200 flex items-center justify-center">
                        {employee.Avatar ? (
                          <img
                            src={`${process.env.REACT_APP_BACKEND_URL}/${employee.Avatar}`}
                            alt={employee.HoTen}
                            className="h-40 w-40 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-500 text-4xl">
                            {employee.HoTen.charAt(0)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Mã nhân viên:</p>
                        <p className="font-medium">{employee.MaNhanVien}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Ngày bắt đầu làm việc:
                        </p>
                        <p className="font-medium">{employee.startDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tên nhân viên:</p>
                        <p className="font-medium">{employee.HoTen}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Chi nhánh trả lương:
                        </p>
                        <p className="font-medium">{employee.payrollBranch}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Mã chấm công:</p>
                        <p className="font-medium">
                          {employee.timekeepingCode}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Tài khoản Ngân hàng:
                        </p>
                        <p className="font-medium">
                          {employee.STK} - {employee.TenNganHang}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ngày sinh:</p>
                        <p className="font-medium">{employee.NgaySinh}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Số điện thoại:</p>
                        <p className="font-medium">{employee.SoDienThoai}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Giới tính:</p>
                        <p className="font-medium">
                          {employee.GioiTinh ? "Nam" : "Nữ"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email:</p>
                        <p className="font-medium">{employee.Email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Số CMND/CCCD:</p>
                        <p className="font-medium">{employee.CCCD}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Địa chỉ:</p>
                        <p className="font-medium">{employee.DiaChi}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Chức danh:</p>
                        <p className="font-medium">
                          {employee.MaVaiTro_vai_tro.Quyen === "NhanVien"
                            ? `Nhân Viên - ${employee?.LoaiNV}`
                            : "Quản Lý"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "salary" && (
                <div className="p-4 text-gray-500">
                  Thông tin thiết lập lương sẽ hiển thị ở đây.
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-2 p-4 border-t bg-gray-50">
              <button
                onClick={handleGetConfirmationCode}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Lấy mã xác nhận
              </button>
              <button
                onClick={() => {
                  setShowModalUpdate(true);
                }}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
              >
                Cập nhật
              </button>
              {employee.TrangThai === "Đang làm" ? (
                <button
                  onClick={() => handleDungLam(employee.MaTK)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                >
                  Ngừng làm việc
                </button>
              ) : (
                <button
                  onClick={() => handleTiepTucLam(employee.MaTK)}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
                >
                  Tiếp tục công việc
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Code Popup */}
      {showConfirmationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Mã xác nhận
              </h3>
              <button
                onClick={closeConfirmationPopup}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="text-center mb-6">
              <p className="text-gray-600 mb-4">
                Mã xác nhận cho nhân viên: <strong>{employee.HoTen}</strong>
              </p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-2xl font-mono font-bold text-blue-600">
                  {confirmationCode}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              >
                Sao chép
              </button>
              <button
                onClick={closeConfirmationPopup}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
