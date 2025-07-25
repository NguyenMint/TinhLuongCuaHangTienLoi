import React, { useEffect, useState } from "react";

import { CircleUserRound, IdCard, X } from "lucide-react";

const ApproveModal = ({
  shift,
  employees,
  onClose,
  onSave,
  onDelete,
  setDataUpdate,
  dataUpdate,
  luongTheoGio,
  isLoadingForLuong,
}) => {
  const [activeTab, setActiveTab] = useState("checkin");
  const [formData, setFormData] = useState({
    ...shift,
    attendanceType: shift.attendanceType || "working",
    substituteId: shift.substituteId || "",
  });

  // Set initial dataUpdate when formData changes
  useEffect(() => {
    setDataUpdate({});
  }, [formData, setDataUpdate]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">Đăng ký ca</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X />
          </button>
        </div>
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <CircleUserRound />
              <span>{formData.MaTK_tai_khoan.HoTen}</span>
            </div>
            <div className="flex items-center gap-2">
              <IdCard />
              <span>{formData.MaTK_tai_khoan.MaNhanVien}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <div className="text-sm text-gray-500">Thời gian</div>
              <div className="font-medium">{formData.NgayLam}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Ca làm việc</div>
              <div className="font-medium">
                {formData.MaCaLam_ca_lam.TenCa} (
                {formData.MaCaLam_ca_lam.ThoiGianBatDau} -{" "}
                {formData.MaCaLam_ca_lam.ThoiGianKetThuc})
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 flex justify-center gap-2">
          {formData.TrangThai === "Chờ Xác Nhận" && (
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={() => onSave(formData.MaLLV)}
            >
              Duyệt
            </button>
          )}
          <button
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
            onClick={onClose}
          >
            Bỏ qua
          </button>
          {formData.TrangThai === "Chờ Xác Nhận" && <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={() => onDelete(formData.MaLLV)}
          >
            Từ chối
          </button>}
        </div>
      </div>
    </div>
  );
};

export default ApproveModal;
