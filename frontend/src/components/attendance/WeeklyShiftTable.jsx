import React from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { vi } from "date-fns/locale";
import { PlusIcon } from "lucide-react";
const WeeklyShiftTable = ({ currentDate, onShiftClick, schedules, shifts }) => {
  const startDate = startOfWeek(currentDate, {
    weekStartsOn: 1,
  });

  const weekDays = Array.from(
    {
      length: 7,
    },
    (_, i) => addDays(startDate, i)
  );

  const getShiftsByShiftIdAndDay = (shiftId, date) => {
    const dateKey = format(date, "yyyy-MM-dd");

    return schedules.filter(
      (s) => s.MaCaLam === shiftId && s.NgayDangKy === dateKey
    );
  };

  const renderShift = (shift, date) => {
    const dayShifts = getShiftsByShiftIdAndDay(shift.MaCa, date);

    return (
      <div>
        {dayShifts.length > 0
          ? dayShifts.map((dayShift) => {
              const late = dayShift.cham_congs[0]?.DiTre;
              const early = dayShift.cham_congs[0]?.VeSom;

              return (
                <div
                  key={dayShift.MaCaLam + dayShift.MaNS + date}
                  className={`p-3 m-1 rounded cursor-pointer 
                ${late > 0 || early > 0 ? "bg-purple-200" : "bg-blue-100"}
              `}
                  onClick={() => onShiftClick(dayShift)}
                >
                  <div className="font-medium text-sm">
                    {dayShift.MaNS_tai_khoan.HoTen}
                  </div>

                  <div className="text-xs">
                    {dayShift.MaCaLam_ca_lam.ThoiGianBatDau} -{" "}
                    {dayShift.MaCaLam_ca_lam.ThoiGianKetThuc}
                  </div>

                  {(late || early) && (
                    <div className="text-xs text-purple-700">
                      {late > 0 && `Đi muộn ${late}p`}
                      {late > 0 && early > 0 && ", "}
                      {early > 0 && `Về sớm ${early}p`}
                    </div>
                  )}
                </div>
              );
            })
          : null}
      </div>
    );
  };
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ca làm việc
            </th>
            {weekDays.map((day, index) => (
              <th
                key={index}
                className="text-center px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {format(day, "EEEE d", {
                  locale: vi,
                })}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {shifts.map((shift) => (
            <tr key={shift.MaCa} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="font-medium">{shift.TenCa}</div>
                  <div className="text-xs text-gray-500">
                    {shift.ThoiGianBatDau} - {shift.ThoiGianKetThuc}{" "}
                  </div>
                </div>
              </td>
              {weekDays.map((day, index) => (
                <td
                  key={index}
                  className="whitespace-nowrap border p-1 align-top"
                >
                  {renderShift(shift, day)}
                </td>
              ))}
              {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Chưa thiết lập lương
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default WeeklyShiftTable;
