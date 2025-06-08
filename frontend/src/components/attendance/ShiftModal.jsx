import React, { useState } from "react";
import CheckInTab from "./TabContent/CheckInTab";
import HistoryTab from "./TabContent/HistoryTab";
import ViolationsTab from "./TabContent/ViolationsTab";
import RewardsTab from "./TabContent/RewardsTab";
const ShiftModal = ({
  shift,
  employees,
  onClose,
  onSave,
  onDelete,
  setDataUpdate,
}) => {
  const [activeTab, setActiveTab] = useState("checkin");
  const [formData, setFormData] = useState({
    ...shift,
    attendanceType: shift.attendanceType || "working",
    substituteId: shift.substituteId || "",
  });
  // console.log(formData.cham_congs.length > 0);
  // console.log(formData);
  console.log(formData);
  
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
    if (formData.cham_congs[0]?.DiTre > 0 && formData.cham_congs[0]?.VeSom > 0) {
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
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
              <span>{formData.MaNS_tai_khoan.HoTen}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                ></path>
              </svg>
              <span>{formData.MaNS}</span>
            </div>
            {getStatusBadge()}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <div className="text-sm text-gray-500">Thời gian</div>
              <div className="font-medium">{formData.NgayDangKy}</div>
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
              employees={employees}
              onChange={handleInputChange}
            />
          )}
          {activeTab === "history" && (
            <HistoryTab attendanceHistory={shift.attendanceHistory || []} />
          )}
          {activeTab === "violations" && (
            <ViolationsTab
              violations={shift.violations || []}
              onUpdate={(violations) =>
                handleInputChange("violations", violations)
              }
            />
          )}
          {activeTab === "rewards" && (
            <RewardsTab
              rewards={shift.rewards || []}
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
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
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
