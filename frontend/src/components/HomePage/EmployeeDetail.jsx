import React, { useState } from "react";
import { CalendarIcon, DollarSignIcon, CoinsIcon, X } from "lucide-react";
import {
  updateNgungLamViec,
  updateTiepTucLamViec,
} from "../../api/apiTaiKhoan";
import { CertificatesTab } from "./CertTab/CertificatesTab";
import { InfoTab } from "./CertTab/InfoTab";
import { PhuCapTab } from "./PhuCapTab";

export const EmployeeDetail = ({
  selectedEmployee,
  activeTab,
  setActiveTab,
  onEmployeeStatusChange,
  setShowModalUpdate,
  showDetail,
  setShowDetail,
  chungChis,
  onSuccess,
  phuCaps,
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
          <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              Chi tiết nhân viên: {selectedEmployee?.HoTen}
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
                  activeTab === "chungchi"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("chungchi")}
              >
                <div className="flex items-center">
                  <span>Chứng chỉ</span>
                </div>
              </button>

              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "phucap"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("phucap")}
              >
                <div className="flex items-center">
                  <span>Phụ cấp</span>
                </div>
              </button>
            </div>

            {/* Tab content */}
            <div className="p-4">
              {activeTab === "info" && (
                <InfoTab selectedEmployee={selectedEmployee} />
              )}
              {activeTab === "chungchi" && (
                <CertificatesTab
                  chungChis={chungChis}
                  // onEdit={onEdit}
                  // onDelete={onDelete}
                  onSuccess={onSuccess}
                  selectedEmployee={selectedEmployee}
                />
              )}
              {activeTab === "phucap" && (
                <PhuCapTab
                  phuCaps={phuCaps}
                  onSuccess={onSuccess}
                  selectedEmployee={selectedEmployee}
                />
              )}
            </div>

            {/* Action buttons */}
            <div className="flex sticky bottom-0 justify-end space-x-2 p-4 border-t bg-gray-50">
              <button
                onClick={() => {
                  setShowModalUpdate(true);
                }}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
              >
                Cập nhật
              </button>
              {selectedEmployee?.TrangThai === "Đang làm" ? (
                <button
                  onClick={() => handleDungLam(selectedEmployee.MaTK)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                >
                  Ngừng làm việc
                </button>
              ) : (
                <button
                  onClick={() => handleTiepTucLam(selectedEmployee.MaTK)}
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
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-4">
                Mã xác nhận cho nhân viên:{" "}
                <strong>{selectedEmployee.HoTen}</strong>
              </p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-2xl font-mono font-bold text-blue-600">
                  {confirmationCode}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
