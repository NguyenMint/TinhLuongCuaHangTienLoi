import React, { useEffect, useState } from "react";
import { XIcon } from "lucide-react";
import { format, parse, differenceInMinutes } from "date-fns";
import { vi } from "date-fns/locale";

export const CheckInTab = ({
  isOpen,
  onClose,
  employee,
  date,
  shift,
  formData,
  employees,
  onChange,
  setDataUpdate,
}) => {
  const startTime = formData.MaCaLam_ca_lam.ThoiGianBatDau;
  const endTime = formData.MaCaLam_ca_lam.ThoiGianKetThuc;
  // console.log(startTime, endTime);
  // console.log(formData.cham_congs[0]?.GioVao);

  const getTimeHHmm = (time) => {
    if (!time) return "";
    return format(new Date(`2000-01-01T${time}`), "HH:mm");
  };

  const [activeTab, setActiveTab] = useState("timekeeping");
  const [workStatus, setWorkStatus] = useState("working");
  const [notes, setNotes] = useState("");
  // Check-in state
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(
    getTimeHHmm(formData.cham_congs[0]?.GioVao) || startTime
  );
  const [checkInLateHours, setCheckInLateHours] = useState("0");
  const [checkInLateMinutes, setCheckInLateMinutes] = useState("0");
  // Check-out state
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [checkOutTime, setCheckOutTime] = useState(
    getTimeHHmm(formData.cham_congs[0]?.GioRa) || endTime
  );
  const [checkOutEarlyHours, setCheckOutEarlyHours] = useState("0");
  const [checkOutEarlyMinutes, setCheckOutEarlyMinutes] = useState("0");

  const getTimeDifference = (time1, time2) => {
    const [hours1, minutes1] = time1.split(":").map(Number);
    const [hours2, minutes2] = time2.split(":").map(Number);
    const date1 = new Date(2000, 0, 1, hours1, minutes1);
    const date2 = new Date(2000, 0, 1, hours2, minutes2);
    return differenceInMinutes(date2, date1);
  };
  const getCheckInStatus = () => {
    // const diff = getTimeDifference(shift.startTime, checkInTime);
    const diff = getTimeDifference(startTime, checkInTime);
    if (diff > 0) return "late";
    if (diff < 0) return "overtime";
    return "ontime";
  };
  const getCheckOutStatus = () => {
    // const diff = getTimeDifference(shift.endTime, checkOutTime);
    const diff = getTimeDifference(endTime, checkOutTime);
    if (diff < 0) return "early";
    if (diff > 0) return "overtime";
    return "ontime";
  };
  const tabs = [
    {
      id: "working",
      label: "Đang làm việc",
    },
    {
      id: "excused",
      label: "Nghỉ có phép",
    },
    {
      id: "unexcused",
      label: "Nghỉ không phép",
    },
  ];

  useEffect(() => {
    if (isCheckedIn && checkInStatus === "late") {
      const lateMinutes = getTimeDifference(startTime, checkInTime);
      setCheckInLateHours(Math.floor(lateMinutes / 60));
      setCheckInLateMinutes(lateMinutes % 60);
    }
  }, [checkInTime, isCheckedIn]);

  useEffect(() => {

    if (isCheckedOut && checkOutStatus === "early") {
      const earlyMinutes = getTimeDifference(checkOutTime, endTime);
      setCheckOutEarlyHours(Math.floor(earlyMinutes / 60));
      setCheckOutEarlyMinutes(earlyMinutes % 60);
    }
  }, [checkOutTime, isCheckedOut]);
  // if (!isOpen) return null
  const checkInStatus = isCheckedIn ? getCheckInStatus() : null;
  const checkOutStatus = isCheckedOut ? getCheckOutStatus() : null;

  const calcLateMinutes = () =>
    isCheckedIn && checkInStatus === "late"
      ? getTimeDifference(startTime, checkInTime) // > 0
      : 0;

  const calcEarlyMinutes = () =>
    isCheckedOut && checkOutStatus === "early"
      ? getTimeDifference(checkOutTime, endTime) // > 0
      : 0;

  useEffect(() => {
    setDataUpdate({
      GioVao: checkInTime,
      GioRa: checkOutTime,
      MaChamCong: formData.cham_congs[0]?.MaChamCong,
      DiTre: isCheckedIn ? calcLateMinutes() : formData.cham_congs[0]?.DiTre,
      VeSom: isCheckedOut ? calcEarlyMinutes() : formData.cham_congs[0]?.VeSom,
      MaDKC: formData.MaDKC,
      NgayDangKy: formData.NgayDangKy,
    });
  }, [
    checkInTime,
    checkOutTime,
    isCheckedIn,
    isCheckedOut,
    checkInStatus,
    checkOutStatus,
    formData.cham_congs,
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <label className="block text-sm font-medium text-gray-700">
          Chấm công
        </label>

        {tabs.map((status) => (
          <label key={status.id} className="flex items-center gap-2">
            <input
              type="radio"
              name="workStatus"
              value={status.id}
              checked={workStatus === status.id}
              onChange={(e) => setWorkStatus(e.target.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="text-sm text-gray-900">{status.label}</span>
          </label>
        ))}
      </div>
      {/* Check-in Block */}

      <div className="flex items-center gap-4 mb-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isCheckedIn}
            onChange={(e) => {
              const checked = e.target.checked;
              setIsCheckedIn(checked);
              if (checked) {
                setCheckInTime(checkInTime); // auto‑fill start time
              } else {
                setCheckInTime(""); // blank input
                setCheckInLateHours("0");
                setCheckInLateMinutes("0");
              }
            }}
            className="h-4 w-4 text-blue-600 rounded"
          />
          <span>Vào</span>
        </label>

        <input
          type="time"
          placeholder="--:--"
          value={checkInTime}
          disabled={!isCheckedIn}
          onChange={(e) => setCheckInTime(e.target.value)}
          className={`px-3 py-2 border rounded-md
                ${
                  isCheckedIn
                    ? "border-gray-300"
                    : "border-gray-200 bg-gray-100 cursor-not-allowed"
                }`}
        />

        {isCheckedIn && checkInStatus === "late" && (
          <div className="flex items-center gap-2 ml-6">
            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
              Đi muộn
            </span>
            <input
              type="number"
              min="0"
              value={checkInLateHours}
              onChange={(e) => setCheckInLateHours(e.target.value)}
              className="w-16 px-2 py-1 border border-gray-300 rounded-md"
            />
            <span>giờ</span>
            <input
              type="number"
              min="0"
              max="59"
              value={checkInLateMinutes}
              onChange={(e) => setCheckInLateMinutes(e.target.value)}
              className="w-16 px-2 py-1 border border-gray-300 rounded-md"
            />
            <span>phút</span>
          </div>
        )}

        {isCheckedIn && checkInStatus === "overtime" && (
          <span className="ml-6 px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
            Tăng ca
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isCheckedOut}
            onChange={(e) => {
              const checked = e.target.checked;
              setIsCheckedOut(checked);
              if (checked) {
                setCheckOutTime(checkOutTime);
              } else {
                setCheckOutTime("");
                setCheckOutEarlyHours("0");
                setCheckOutEarlyMinutes("0");
              }
            }}
            className="h-4 w-4 text-blue-600 rounded"
          />
          <span className="pr-2">Ra</span>
        </label>

        <input
          type="time"
          placeholder="--:--"
          value={checkOutTime}
          disabled={!isCheckedOut}
          onChange={(e) => setCheckOutTime(e.target.value)}
          className={`px-3 py-2 border rounded-md
                ${
                  isCheckedOut
                    ? "border-gray-300"
                    : "border-gray-200 bg-gray-100 cursor-not-allowed"
                }`}
        />

        {isCheckedOut && checkOutStatus === "early" && (
          <div className="flex items-center gap-2 ml-6">
            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
              Về sớm
            </span>
            <input
              type="number"
              min="0"
              value={checkOutEarlyHours}
              onChange={(e) => setCheckOutEarlyHours(e.target.value)}
              className="w-16 px-2 py-1 border border-gray-300 rounded-md"
            />
            <span>giờ</span>
            <input
              type="number"
              min="0"
              max="59"
              value={checkOutEarlyMinutes}
              onChange={(e) => setCheckOutEarlyMinutes(e.target.value)}
              className="w-16 px-2 py-1 border border-gray-300 rounded-md"
            />
            <span>phút</span>
          </div>
        )}

        {isCheckedOut && checkOutStatus === "overtime" && (
          <span className="ml-6 px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
            Tăng ca
          </span>
        )}
      </div>
    </div>
  );
};
export default CheckInTab;
