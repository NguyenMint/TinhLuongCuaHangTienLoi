import React, { useEffect, useState, useMemo } from "react";
import CheckInTab from "./TabContent/CheckInTab";
import HistoryTab from "./TabContent/HistoryTab";
import ViolationsTab from "./TabContent/ViolationsTab";
import RewardsTab from "./TabContent/RewardsTab";
import { CircleUserRound, IdCard, X } from "lucide-react";
import { formatDate } from "../../utils/format.js";
import { getNghiThaiSanByMaTK } from "../../api/apiNghiThaiSan";

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
    violations: shift.violations || [],
    rewards: shift.rewards || [],
  });
  const [quyenLoiThaiSan, setQuyenLoiThaiSan] = useState(false);
  const [vuot30p, setVuot30p] = useState(0);

  // Memoize formData fields to stabilize dependencies
  const formDataDeps = useMemo(
    () => ({
      cham_congs: formData.cham_congs,
      violations: formData.violations,
      rewards: formData.rewards,
      MaLLV: formData.MaLLV,
      NgayLam: formData.NgayLam,
      MaTK: formData.MaTK_tai_khoan.MaTK,
      ThoiGianBatDau: formData.MaCaLam_ca_lam.ThoiGianBatDau,
      ThoiGianKetThuc: formData.MaCaLam_ca_lam.ThoiGianKetThuc,
    }),
    [
      formData.cham_congs,
      formData.violations,
      formData.rewards,
      formData.MaLLV,
      formData.NgayLam,
      formData.MaTK_tai_khoan.MaTK,
      formData.MaCaLam_ca_lam.ThoiGianBatDau,
      formData.MaCaLam_ca_lam.ThoiGianKetThuc,
    ]
  );

  // Synchronize dataUpdate with formData
  useEffect(() => {
    setDataUpdate((prev) => {
      const newDataUpdate = {
        ...prev,
        GioVao:
          formDataDeps.cham_congs[0]?.GioVao || formDataDeps.ThoiGianBatDau,
        GioRa:
          formDataDeps.cham_congs[0]?.GioRa || formDataDeps.ThoiGianKetThuc,
        MaChamCong: formDataDeps.cham_congs[0]?.MaChamCong,
        DiTre: formDataDeps.cham_congs[0]?.DiTre || 0,
        VeSom: formDataDeps.cham_congs[0]?.VeSom || 0,
        MaLLV: formDataDeps.MaLLV,
        NgayLam: formDataDeps.NgayLam,
        MaTK: formDataDeps.MaTK,
        violations: formDataDeps.violations || [],
        rewards: formDataDeps.rewards || [],
      };
      if (JSON.stringify(newDataUpdate) !== JSON.stringify(prev)) {
        return newDataUpdate;
      }
      return prev;
    });
  }, [formDataDeps, setDataUpdate]);

  useEffect(() => {
    async function checkThaiSan() {
      if (!formData.MaTK_tai_khoan?.MaTK || !formData.NgayLam) return;
      const res = await getNghiThaiSanByMaTK(formData.MaTK_tai_khoan.MaTK);
      const today = new Date(formData.NgayLam);
      const nts = res.data.find((nts) => {
        if (nts.TrangThai === "Đang nghĩ" || nts.TrangThai === "Đã duyệt") {
          const start = new Date(nts.NgayBatDau);
          const end = new Date(nts.NgayKetThuc);
          return today >= start && today <= end;
        }
        return false;
      });
      if (nts) {
        setQuyenLoiThaiSan(true);
        const veSom = formData.cham_congs[0]?.VeSom || 0;
        setVuot30p(veSom > 30 ? veSom - 30 : 0);
      } else {
        setQuyenLoiThaiSan(false);
        setVuot30p(0);
      }
    }
    checkThaiSan();
  }, [formData.MaTK_tai_khoan?.MaTK, formData.NgayLam, formData.cham_congs]);

  const tabs = [
    { id: "checkin", label: "Chấm công" },
    // { id: "history", label: "Lịch sử chấm công" },
    { id: "violations", label: "Phạt vi phạm" },
    { id: "rewards", label: "Thưởng" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    setDataUpdate((prev) => ({
      ...prev,
      GioVao:
        formData.cham_congs[0]?.GioVao ||
        formData.MaCaLam_ca_lam.ThoiGianBatDau,
      GioRa:
        formData.cham_congs[0]?.GioRa ||
        formData.MaCaLam_ca_lam.ThoiGianKetThuc,
      MaChamCong: formData.cham_congs[0]?.MaChamCong,
      DiTre: formData.cham_congs[0]?.DiTre || 0,
      VeSom: formData.cham_congs[0]?.VeSom || 0,
      MaLLV: formData.MaLLV,
      NgayLam: formData.NgayLam,
      MaTK: formData.MaTK_tai_khoan.MaTK,
      violations: formData.violations || [],
      rewards: formData.rewards || [],
    }));
    onSave(formData);
  };

  const getStatusBadge = () => {
    const chamCong = formData.cham_congs[0];
    if (chamCong?.DiTre > 0 && chamCong?.VeSom > 0) {
      return (
        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
          Đi muộn / Về sớm
        </span>
      );
    } else if (chamCong?.DiTre > 0) {
      return (
        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
          Đi muộn
        </span>
      );
    } else if (chamCong?.VeSom > 0) {
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
          {/* <button
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
            onClick={() => handleInputChange("shiftChanged", true)}
          >
            Đổi ca
          </button> */}
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
