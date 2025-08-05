import React, { useEffect, useState, useMemo } from "react";
import { format, differenceInMinutes } from "date-fns";
import { calculatePhat } from "../../../utils/TreSom";
import { getNghiThaiSanByMaTK } from "../../../api/apiNghiThaiSan";

export const CheckInTab = ({
  isOpen,
  onClose,
  employee,
  date,
  shift,
  formData,
  onChange,
  setDataUpdate,
}) => {
  const startTime = formData.MaCaLam_ca_lam.ThoiGianBatDau;
  const endTime = formData.MaCaLam_ca_lam.ThoiGianKetThuc;
  const luongTheoGio = formData.MaTK_tai_khoan?.LuongTheoGioHienTai;

  const getTimeHHmm = (time) => {
    if (!time) return "";
    return format(new Date(`2000-01-01T${time}`), "HH:mm");
  };

  const [workStatus, setWorkStatus] = useState("working");
  const [isCheckedIn, setIsCheckedIn] = useState(
    !!formData.cham_congs[0]?.GioVao
  );
  const [checkInTime, setCheckInTime] = useState(
    getTimeHHmm(formData.cham_congs[0]?.GioVao) || startTime
  );
  const [checkInLateHours, setCheckInLateHours] = useState("0");
  const [checkInLateMinutes, setCheckInLateMinutes] = useState("0");

  const [isCheckedOut, setIsCheckedOut] = useState(
    !!formData.cham_congs[0]?.GioRa
  );
  const [checkOutTime, setCheckOutTime] = useState(
    getTimeHHmm(formData.cham_congs[0]?.GioRa) || endTime
  );
  const [checkOutEarlyHours, setCheckOutEarlyHours] = useState("0");
  const [checkOutEarlyMinutes, setCheckOutEarlyMinutes] = useState("0");

  const getTimeDifference = (time1, time2) => {
    if (!time1 || !time2) return 0;
    const [hours1, minutes1] = time1.split(":").map(Number);
    const [hours2, minutes2] = time2.split(":").map(Number);
    const date1 = new Date(2000, 0, 1, hours1, minutes1);
    const date2 = new Date(2000, 0, 1, hours2, minutes2);
    return differenceInMinutes(date2, date1);
  };

  const getCheckInStatus = () => {
    if (!checkInTime || !isCheckedIn) return null;
    const diff = getTimeDifference(startTime, checkInTime);
    if (diff > 10) return "late";
    if (diff < 0) return "overtime";
    return "ontime";
  };

  const getCheckOutStatus = () => {
    if (!checkOutTime || !isCheckedOut) return null;
    const diff = getTimeDifference(endTime, checkOutTime);
    if (diff < -10) return "early";
    if (diff > 0) return "overtime";
    return "ontime";
  };

  const checkInStatus = getCheckInStatus();
  const checkOutStatus = getCheckOutStatus();

  // Calculate late/early minutes and violations
  const lateMinutes = useMemo(
    () =>
      isCheckedIn && checkInStatus === "late"
        ? getTimeDifference(startTime, checkInTime)
        : 0,
    [isCheckedIn, checkInStatus, checkInTime, startTime]
  );
  const rawEarlyMinutes = useMemo(
    () =>
      isCheckedOut && checkOutStatus === "early"
        ? Math.abs(getTimeDifference(checkOutTime, endTime))
        : 0,
    [isCheckedOut, checkOutStatus, checkOutTime, endTime]
  );
  const [quyenLoiThaiSan, setQuyenLoiThaiSan] = useState(false);
  const [veSomThucTe, setVeSomThucTe] = useState(0);
  const [vuot30p, setVuot30p] = useState(0);
  
  useEffect(() => {
    async function checkThaiSan() {
      if (!formData.MaTK_tai_khoan?.MaTK || !formData.NgayLam) return;
      const res = await getNghiThaiSanByMaTK(formData.MaTK_tai_khoan.MaTK);
      const today = new Date(formData.NgayLam);
      const nts = res.data.find(nts => {
        if (nts.TrangThai == 1) {
          const start = new Date(nts.NgayBatDau);
          const end = new Date(nts.NgayKetThuc);
          return today >= start && today <= end;
        }
        return false;
      });
      if (nts) {
        setQuyenLoiThaiSan(true);
        setVeSomThucTe(rawEarlyMinutes);
        setVuot30p(rawEarlyMinutes > 30 ? rawEarlyMinutes - 30 : 0);
      } else {
        setQuyenLoiThaiSan(false);
        setVeSomThucTe(rawEarlyMinutes);
        setVuot30p(0);
      }
    }
    checkThaiSan();
  }, [formData.MaTK_tai_khoan?.MaTK, formData.NgayLam, rawEarlyMinutes]);

  useEffect(() => {
    setCheckOutEarlyHours(Math.floor((quyenLoiThaiSan && vuot30p > 0 ? vuot30p : rawEarlyMinutes) / 60));
    setCheckOutEarlyMinutes((quyenLoiThaiSan && vuot30p > 0 ? vuot30p : rawEarlyMinutes) % 60);
  }, [rawEarlyMinutes, quyenLoiThaiSan, vuot30p]);

  // Update cham_congs and violations
  useEffect(() => {
    const VeSom = quyenLoiThaiSan ? (vuot30p > 0 ? vuot30p : 0) : rawEarlyMinutes;
    const newChamCong = {
      ...formData.cham_congs[0],
      GioVao: isCheckedIn ? checkInTime : null,
      GioRa: isCheckedOut ? checkOutTime : null,
      DiTre: lateMinutes,
      VeSom,
    };

    let newViolations = (formData.violations || []).filter((v) => !v.isAuto);

    if (luongTheoGio) {
      if (lateMinutes > 0) {
        newViolations.push({
          MaKTKL: `auto_late_${Date.now()}`,
          LyDo: "Đi muộn",
          MucThuongPhat: calculatePhat(lateMinutes, luongTheoGio),
          DuocMienThue: true,
          isAuto: true,
        });
      }
      if (VeSom > 0) {
        newViolations.push({
          MaKTKL: `auto_early_${Date.now()}`,
          LyDo: "Về sớm",
          MucThuongPhat: calculatePhat(VeSom, luongTheoGio),
          DuocMienThue: true,
          isAuto: true,
        });
      }
    }

    if (JSON.stringify(formData.cham_congs) !== JSON.stringify([newChamCong])) {
      onChange("cham_congs", [newChamCong]);
    }

    if (JSON.stringify(formData.violations) !== JSON.stringify(newViolations)) {
      onChange("violations", newViolations);
    }

    setDataUpdate((prev) => {
      const updated = {
        ...prev,
        GioVao: isCheckedIn ? checkInTime : "",
        GioRa: isCheckedOut ? checkOutTime : "",
        DiTre: lateMinutes,
        VeSom,
        violations: newViolations,
      };
      if (JSON.stringify(updated) !== JSON.stringify(prev)) return updated;
      return prev;
    });
  }, [
    isCheckedIn,
    isCheckedOut,
    checkInTime,
    checkOutTime,
    lateMinutes,
    rawEarlyMinutes,
    luongTheoGio,
    onChange,
    setDataUpdate,
    formData.cham_congs,
    quyenLoiThaiSan,
    vuot30p,
  ]);

  // const tabs = [
  //   { id: "working", label: "Đang làm việc" },
  //   { id: "excused", label: "Nghỉ có phép" },
  //   { id: "unexcused", label: "Nghỉ không phép" },
  // ];

  return (
    <div className="space-y-6">
      {/* <div className="flex items-center gap-6">
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
      </div> */}
      <div className="flex items-center gap-4 mb-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isCheckedIn}
            onChange={(e) => {
              const checked = e.target.checked;
              setIsCheckedIn(checked);
              if (!checked) {
                setCheckInTime("");
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
          className={`px-3 py-2 border rounded-md ${
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
        {/* {isCheckedIn && checkInStatus === "overtime" && (
          <span className="ml-6 px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
            Tăng ca
          </span>
        )} */}
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isCheckedOut}
            onChange={(e) => {
              const checked = e.target.checked;
              setIsCheckedOut(checked);
              if (!checked) {
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
          className={`px-3 py-2 border rounded-md ${
            isCheckedOut
              ? "border-gray-300"
              : "border-gray-200 bg-gray-100 cursor-not-allowed"
          }`}
        />
        {isCheckedOut && checkOutStatus === "early" && (
          quyenLoiThaiSan && veSomThucTe <= 30 ? null : (
            <div className="flex items-center gap-2 ml-6">
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                Về sớm{quyenLoiThaiSan && vuot30p > 0 ? ` (${vuot30p} phút vượt quyền lợi)` : ""}
              </span>
              <input
                type="number"
                min="0"
                value={ checkOutEarlyHours }
                onChange={(e) => setCheckOutEarlyHours(e.target.value)}
                className="w-16 px-2 py-1 border border-gray-300 rounded-md"
                disabled={quyenLoiThaiSan && vuot30p === 0}
              />
              <span>giờ</span>
              <input
                type="number"
                min="0"
                max="59"
                value={checkOutEarlyMinutes}
                onChange={(e) => setCheckOutEarlyMinutes(e.target.value)}
                className="w-16 px-2 py-1 border border-gray-300 rounded-md"
                disabled={quyenLoiThaiSan && vuot30p === 0}
              />
              <span>phút</span>
            </div>
          )
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
