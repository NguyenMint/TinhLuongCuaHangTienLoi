import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  updateNgungLamViec,
  updateTiepTucLamViec,
} from "../../api/apiTaiKhoan";
import { CertificatesTab } from "./CertTab/CertificatesTab";
import { HopDongTab } from "./HopDongTab/HopDongTab";
import { InfoTab } from "./InfoTab";
import { PhuCapTab } from "./PhuCapTab";
import { DependentPersonList } from "./DependentPersonTab/DependentPersonList";
import { LeaveRequestTab } from "./LeaveRequestHistoryTab/LeaveRequestList";
import { NghiThaiSanTab } from "./NghiThaiSanTab";
import { getNghiThaiSanByMaTK } from "../../api/apiNghiThaiSan";
import { fetchLichSuTangLuong } from "../../api/apiTaiKhoan";
import { formatCurrency } from "../../utils/format";
import { toast } from "react-toastify";

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
  hopDongs,
  setSelectedEmployee,
}) => {
  const [quyenLoiThaiSan, setQuyenLoiThaiSan] = useState(false);
  const [lichSuTangLuong, setLichSuTangLuong] = useState([]);

  useEffect(() => {
    let ignore = false;
    async function checkThaiSan() {
      if (!selectedEmployee) return;
      const res = await getNghiThaiSanByMaTK(selectedEmployee.MaTK);
      const today = new Date();
      const hasThaiSan = res.data.some((nts) => {
        if (nts.TrangThai == 1) {
          const start = new Date(nts.NgayBatDau);
          const end = new Date(nts.NgayKetThuc);
          return today >= start && today <= end;
        }
        return false;
      });
      if (!ignore) setQuyenLoiThaiSan(hasThaiSan);
    }
    checkThaiSan();
    return () => {
      ignore = true;
    };
  }, [selectedEmployee, showDetail]);

  useEffect(() => {
    if (showDetail && selectedEmployee) {
      fetchLichSuTangLuong(selectedEmployee.MaTK).then(setLichSuTangLuong);
    }
  }, [showDetail, selectedEmployee]);

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
      toast.error("Lỗi: " + (error.message || "Lỗi không xác định"));
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
      toast.error("Lỗi: " + (error.message || "Lỗi không xác định"));
    }
  };

  const closeDetailModal = () => {
    setShowDetail(false);
    setSelectedEmployee(null);
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
            {quyenLoiThaiSan && (
              <div className="bg-pink-100 border-l-4 border-pink-500 text-pink-800 p-4 mb-2 rounded flex items-center">
                <span className="font-semibold mr-2">Quyền lợi:</span>
                Trong thời gian nghỉ thai sản, nhân viên được phép về sớm 30
                phút mỗi ngày.
              </div>
            )}
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
                  activeTab === "hopdong"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("hopdong")}
              >
                <div className="flex items-center">
                  <span>Hợp đồng</span>
                </div>
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "nguoiphuthuoc"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("nguoiphuthuoc")}
              >
                <div className="flex items-center">
                  <span>Người phụ thuộc</span>
                </div>
              </button>

              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "donnghiphep"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("donnghiphep")}
              >
                <div className="flex items-center">
                  <span>Lịch sử nghỉ phép</span>
                </div>
              </button>
              {selectedEmployee.GioiTinh == false && (
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "nghithaisan"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("nghithaisan")}
                >
                  <div className="flex items-center">
                    <span>Nghỉ thai sản</span>
                  </div>
                </button>
              )}
            </div>

            {/* Tab content */}
            <div className="p-4">
              {activeTab === "info" && (
                <>
                  <InfoTab selectedEmployee={selectedEmployee} />
                  {/* Lịch sử tăng lương */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Lịch sử tăng lương</h3>
                    {lichSuTangLuong.length === 0 ? (
                      <div className="text-gray-500">Chưa có lịch sử tăng lương</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full border text-sm">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="px-3 py-2 border">Ngày áp dụng</th>
                              <th className="px-3 py-2 border">Bậc lương cũ</th>
                              <th className="px-3 py-2 border">Bậc lương mới</th>
                              <th className="px-3 py-2 border">Lương cơ bản cũ</th>
                              <th className="px-3 py-2 border">Lương cơ bản mới</th>
                              <th className="px-3 py-2 border">Lương theo giờ cũ</th>
                              <th className="px-3 py-2 border">Lương theo giờ mới</th>
                            </tr>
                          </thead>
                          <tbody>
                            {lichSuTangLuong.map((row, idx) => (
                              <tr key={idx} className="text-center">
                                <td className="border px-2 py-1">{row.NgayApDung}</td>
                                <td className="border px-2 py-1">{row.BacLuongCu ?? '-'}</td>
                                <td className="border px-2 py-1">{row.BacLuongMoi ?? '-'}</td>
                                <td className="border px-2 py-1">{row.LuongCoBanCu ? formatCurrency(row.LuongCoBanCu) : '-'}</td>
                                <td className="border px-2 py-1">{row.LuongCoBanMoi ? formatCurrency(row.LuongCoBanMoi) : '-'}</td>
                                <td className="border px-2 py-1">{row.LuongTheoGioCu ? formatCurrency(row.LuongTheoGioCu) : '-'}</td>
                                <td className="border px-2 py-1">{row.LuongTheoGioMoi ? formatCurrency(row.LuongTheoGioMoi) : '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
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

              {activeTab === "hopdong" && (
                <HopDongTab
                  hopDongs={hopDongs}
                  // onEdit={onEdit}
                  // onDelete={onDelete}
                  onSuccess={onSuccess}
                  selectedEmployee={selectedEmployee}
                />
              )}

              {activeTab === "nguoiphuthuoc" && (
                <DependentPersonList employee={selectedEmployee} />
              )}

              {activeTab === "donnghiphep" && (
                <LeaveRequestTab MaTK={selectedEmployee.MaTK}></LeaveRequestTab>
              )}
              {activeTab === "nghithaisan" && (
                <NghiThaiSanTab
                  selectedEmployee={selectedEmployee}
                  onSuccess={onSuccess}
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
    </>
  );
};
