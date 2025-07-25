// EmployeeShiftRegistration.jsx
import React, { useState } from "react";
import { format, addDays, startOfWeek, addWeeks, subWeeks } from "date-fns";
import { vi } from "date-fns/locale";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export const ShiftRegistration = ({
  currentDate,
  onDangKyCa,
  lichLamViec,
  shifts,
  setShowControl,
  setSelectedLLV,
}) => {
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const startDate = startOfWeek(selectedDate, {
    weekStartsOn: 1,
  });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  const weekNumber = Math.ceil(selectedDate.getDate() / 7);
  const monthYear = format(selectedDate, "MM.yyyy");
  const weekLabel = `Tuần ${weekNumber} - Th.${monthYear}`;

  const getShiftBgColor = (shift) => {
    if (shift.TrangThai === "Đã Đăng Ký") return "bg-green-200";
    if (shift.TrangThai === "Hủy Ca" || shift.TrangThai === "Từ Chối")
      return "bg-red-200";
    if (
      shift.TrangThai === "Chờ Xác Nhận" ||
      shift.TrangThai === "Chờ Duyệt Chuyển Ca"
    )
      return "bg-orange-200";
    if (shift.TrangThai === "Chuyển Ca") return "bg-yellow-200";
    return "bg-white hover:bg-gray-50";
  }; 

  const handlePreviousWeek = () => {
    setSelectedDate(subWeeks(selectedDate, 1));
  };

  const handleNextWeek = () => {
    setSelectedDate(addWeeks(selectedDate, 1));
  };

  const handleThisWeek = () => {
    setSelectedDate(new Date());
  };

  const getShiftForDay = (day, maCa) => {
    const dateKey = format(day, "yyyy-MM-dd");
    const shiftForDay = lichLamViec.find(
      (s) => s.NgayLam === dateKey && s.MaCaLam_ca_lam.MaCa === maCa
    );
    return shiftForDay ? shiftForDay : null;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <div className="p-4 border-b flex items-center justify-end">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePreviousWeek}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleThisWeek}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Tuần này
            </button>
            <button
              onClick={handleNextWeek}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-600 ml-2">{weekLabel}</span>
          </div>
        </div>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-20 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ca làm việc
            </th>
            {weekDays.map((day, index) => (
              <th
                key={index}
                className="w-32 text-center px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {format(day, "EEEE", { locale: vi })}
                <br />
                {format(day, "dd/MM")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {shifts && shifts.length > 0 ? (
            shifts.map((shift) => (
              <tr key={shift.MaCa} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium">{shift.TenCa}</div>
                    <div className="text-xs text-gray-500">
                      {shift.ThoiGianBatDau} - {shift.ThoiGianKetThuc}
                    </div>
                  </div>
                </td>
                {weekDays.map((day) => {
                  const lichlamviec = getShiftForDay(day, shift.MaCa);
                  return (
                    <td
                      key={`${shift.MaCa}-${day}`}
                      className="border h-24 border-gray-200 p-1 align-top group"
                    >
                      {lichlamviec ? (
                        <div
                          onClick={() => {
                            setSelectedLLV(lichlamviec);
                            setShowControl(true);
                          }}
                          className={`text-sm border h-full w-full flex items-center justify-center cursor-pointer hover:opacity-60  border-gray-300 rounded p-1 ${getShiftBgColor(
                            {
                              TrangThai: lichlamviec.TrangThai,
                            }
                          )}`}
                        >
                          <div className="font-medium">
                            {lichlamviec.TrangThai}
                          </div>
                        </div>
                      ) : (
                        <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onDangKyCa(shift.MaCa, day)}
                            className="text-blue-500 px-2 py-1 rounded text-sm flex items-center gap-1"
                          >
                            <span>Đăng ký ca</span>
                            <span className="text-lg">+</span>
                          </button>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-8 text-gray-500">
                Không có ca làm việc nào để hiển thị.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
