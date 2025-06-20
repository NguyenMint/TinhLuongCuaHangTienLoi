import React, { useEffect, useState } from "react";
import CheckInTab from "./TabContent/CheckInTab";
import HistoryTab from "./TabContent/HistoryTab";
import ViolationsTab from "./TabContent/ViolationsTab";
import RewardsTab from "./TabContent/RewardsTab";
import { CircleUserRound, IdCard, X } from "lucide-react";
import { calculatePhat } from "../../utils/TreSom";
import { formatDate } from "../../utils/format.js";

const ShiftModal = ({
  shift,
  employees,
  onClose,
  onSave,
  onDelete,
  setDataUpdate,
  dataUpdate,
}) => {
  const [activeTab, setActiveTab] = useState("checkin");
  const [formData, setFormData] = useState({
    ...shift,
    attendanceType: shift.attendanceType || "working",
    substituteId: shift.substituteId || "",
  });

  // Set initial dataUpdate when formData changes
  useEffect(() => {
    const calcLateMinutes = () => {
      if (!formData.cham_congs[0]?.GioVao) return 0;
      const startTime = formData.MaCaLam_ca_lam.ThoiGianBatDau;
      const checkInTime = formData.cham_congs[0]?.GioVao;
      if (!startTime || !checkInTime) return 0;
      const [startHours, startMinutes] = startTime.split(":").map(Number);
      const [checkHours, checkMinutes] = checkInTime.split(":").map(Number);
      const startDate = new Date(2000, 0, 1, startHours, startMinutes);
      const checkDate = new Date(2000, 0, 1, checkHours, checkMinutes);
      const diff = (checkDate - startDate) / (1000 * 60);

      return diff > 10 ? diff : 0;
    };

    const calcEarlyMinutes = () => {
      if (!formData.cham_congs[0]?.GioRa) return 0;
      const endTime = formData.MaCaLam_ca_lam.ThoiGianKetThuc;
      const checkOutTime = formData.cham_congs[0]?.GioRa;
      if (!endTime || !checkOutTime) return 0;
      const [endHours, endMinutes] = endTime.split(":").map(Number);
      const [checkHours, checkMinutes] = checkOutTime.split(":").map(Number);
      const endDate = new Date(2000, 0, 1, endHours, endMinutes);
      const checkDate = new Date(2000, 0, 1, checkHours, checkMinutes);
      const diff = (endDate - checkDate) / (1000 * 60);
      return diff > 10 ? diff : 0;
    };

    setDataUpdate({
      GioVao:
        formData.cham_congs[0]?.GioVao ||
        formData.MaCaLam_ca_lam.ThoiGianBatDau,
      GioRa:
        formData.cham_congs[0]?.GioRa ||
        formData.MaCaLam_ca_lam.ThoiGianKetThuc,
      MaChamCong: formData.cham_congs[0]?.MaChamCong,
      DiTre: formData.cham_congs[0]?.DiTre || calcLateMinutes(),
      VeSom: formData.cham_congs[0]?.VeSom || calcEarlyMinutes(),
      MaLLV: formData.MaLLV,
      NgayLam: formData.NgayLam,
      MaTK: formData.MaTK_tai_khoan.MaTK,
      violations: formData.violations || [],
      rewards: formData.rewards || [],
    });
  }, [formData, setDataUpdate]);

  // Calculate violations when luongTheoGio is loaded
  useEffect(() => {
    // Only calculate violations if luongTheoGio is loaded (not 0) and not currently loading
    const existsData = formData.khen_thuong_ky_luats.filter(
      (item) => item.LyDo === "Đi muộn" || item.LyDo === "Về sớm"
    );
    if (existsData.length > 0) return;

    const chamCong = formData.cham_congs?.[0];
    if (!chamCong) return;

    const isLate = chamCong.DiTre > 0;
    const isEarly = chamCong.VeSom > 0;

    let newViolations = [...(formData.violations || [])];
    let hasChanged = false;

    const addViolation = (type, reason, minutes) => {
      const idPrefix = type === "late" ? "auto_late_" : "auto_early_";
      const existing = newViolations.find((v) => v.LyDo === reason && v.isAuto);
      if (!existing) {
        newViolations.push({
          MaKTKL: `${idPrefix}${Date.now()}`,
          LyDo: reason,
          MucThuongPhat:
            type === "late"
              ? calculatePhat(
                  minutes,
                  formData.MaTK_tai_khoan.LuongTheoGioHienTai
                )
              : calculatePhat(
                  minutes,
                  formData.MaTK_tai_khoan.LuongTheoGioHienTai
                ),
          DuocMienThue: true,
          isAuto: true,
        });
        hasChanged = true;
      }
    };

    const removeViolation = (reason) => {
      const updated = newViolations.filter(
        (v) => !(v.LyDo === reason && v.isAuto)
      );
      if (updated.length !== newViolations.length) {
        newViolations = updated;
        hasChanged = true;
      }
    };

    if (isLate) {
      addViolation("late", "Đi muộn", chamCong.DiTre);
    } else {
      removeViolation("Đi muộn");
    }

    if (isEarly) {
      addViolation("early", "Về sớm", chamCong.VeSom);
    } else {
      removeViolation("Về sớm");
    }

    if (hasChanged) {
      handleInputChange("violations", newViolations);
    }
  }, [formData.cham_congs]); // Added isLoadingForLuong to dependencies

  const tabs = [
    {
      id: "checkin",
      label: "Chấm công",
    },
    {
      id: "history",
      label: "Lịch sử chấm công",
    },
    {
      id: "violations",
      label: "Phạt vi phạm",
    },
    {
      id: "rewards",
      label: "Thưởng",
    },
  ];

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSave = () => {
    onSave(formData);
  };

  const getStatusBadge = () => {
    if (
      formData.cham_congs[0]?.DiTre > 0 &&
      formData.cham_congs[0]?.VeSom > 0
    ) {
      return (
        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
          Đi muộn / Về sớm
        </span>
      );
    } else if (formData.cham_congs[0]?.DiTre > 0) {
      return (
        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
          Đi muộn
        </span>
      );
    } else if (formData.cham_congs[0]?.VeSom > 0) {
      return (
        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
          Về sớm
        </span>
      );
    } else if (formData.attendanceType === "absent-approved") {
      return (
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
          Nghỉ có phép
        </span>
      );
    } else if (formData.cham_congs.length > 0) {
      return (
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
          Đã chấm công
        </span>
      );
    } else if (formData.attendanceType === "absent-unapproved") {
      return (
        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
          Nghỉ không phép
        </span>
      );
    } else {
      return (
        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
          Chưa chấm công
        </span>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">Chấm công</h2>
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
            {getStatusBadge()}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <div className="text-sm text-gray-500">Thời gian</div>
              <div className="font-medium">{formatDate(formData.NgayLam)}</div>
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
          <div className="mt-4">
            <div className="text-sm text-gray-500">Ghi chú</div>
            <input
              type="text"
              className="w-full border rounded-md p-2 mt-1"
              value={formData.note || ""}
              onChange={(e) => handleInputChange("note", e.target.value)}
            />
          </div>
        </div>
        <div className="border-b">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "checkin" && (
            <CheckInTab
              setDataUpdate={setDataUpdate}
              formData={formData}
              onChange={handleInputChange}
            />
          )}
          {activeTab === "history" && (
            <HistoryTab attendanceHistory={shift.attendanceHistory || []} />
          )}
          {activeTab === "violations" && (
            <ViolationsTab
              formData={formData}
              violations={formData.violations || []}
              onUpdate={(violations) =>
                handleInputChange("violations", violations)
              }
            />
          )}
          {activeTab === "rewards" && (
            <RewardsTab
              formData={formData}
              rewards={formData.rewards || []}
              onUpdate={(rewards) => handleInputChange("rewards", rewards)}
            />
          )}
        </div>
        <div className="p-4 border-t flex justify-end gap-2">
          <button
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
            onClick={() => handleInputChange("shiftChanged", true)}
          >
            Đổi ca
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleSave}
          >
            Duyệt
          </button>
          <button
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
            onClick={onClose}
          >
            Bỏ qua
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={() => onDelete(shift.id)}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShiftModal;
