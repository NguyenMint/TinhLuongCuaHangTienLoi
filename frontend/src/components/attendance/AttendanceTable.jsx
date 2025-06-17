import React from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { vi } from "date-fns/locale";
import { PlusIcon } from "lucide-react";
const WeeklyShiftTable = ({ currentDate, onShiftClick, lichLamViecs, shifts }) => {
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

    return lichLamViecs.filter(
      (s) => s.MaCaLam === shiftId && s.NgayLam === dateKey
    );
  };
  const getShiftBgColor = (shift) => {
    const chamCong = shift.cham_congs[0];
    if (!chamCong || !chamCong.GioRa) return "bg-red-100";
    if (chamCong.DiTre > 0 || chamCong.VeSom > 0) return "bg-purple-200";
    if (chamCong.GioVao && chamCong.GioRa) return "bg-blue-100";
    return "bg-red-100";
  };

  const renderShift = (shift, date) => {
    const dayShifts = getShiftsByShiftIdAndDay(shift.MaCa, date);
    // console.log(dayShifts);

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
                    ${getShiftBgColor(dayShift)}`}
                  onClick={() => onShiftClick(dayShift)}
                >
                  <div className="font-medium text-sm">
                    {dayShift.MaNS_tai_khoan.HoTen}
                  </div>

                  {dayShift.cham_congs[0]?.GioVao ? (
                    <div className="text-xs">
                      {dayShift.cham_congs[0]?.GioVao}
                      {dayShift.cham_congs[0]?.GioRa ? (
                        <> - {dayShift.cham_congs[0]?.GioRa}</>
                      ) : (
                        <div className="text-xs text-red-500">Chưa chấm ra</div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-red-500">Chưa chấm vào</div>
                  )}

                  {late || early || late > 0 || early > 0 ? (
                    <div className="text-xs text-purple-700">
                      {late > 0 && `Đi muộn ${late}p`}
                      {late > 0 && early > 0 && ", "}
                      {early > 0 && `Về sớm ${early}p`}
                    </div>
                  ) : (
                    <div></div>
                    // <div className="text-xs text-red-500">Chưa chấm ra</div>
                  )}

                  {dayShift.cham_congs[0]?.trangthai === "Chờ duyệt" && (
                    <div className="text-xs text-red-500">Chưa duyệt</div>
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
      <table className="min-w-full divide-y table-fixed divide-gray-200 ">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-20 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ca làm việc
            </th>
            {weekDays.map((day, index) => (
              <th
                key={index}
                className="w-32 text-center px-6 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {format(day, "EEEE", {
                  locale: vi,
                })}
                <br />
                {format(day, "dd/MM")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 text-sm">
          {shifts && shifts.length > 0 ? (
            shifts.map((shift) => (
              <tr key={shift.MaCa} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium">{shift.TenCa}</div>
                    <div className="text-xs text-gray-500">
                      {shift.ThoiGianBatDau} - {shift.ThoiGianKetThuc}{" "}
                    </div>
                  </div>
                </td>
                {weekDays.map((day) => (
                  <td
                    key={`${shift.MaCa}-${day}`}
                    className=" border p-1 align-top "
                  >
                    {renderShift(shift, day)}
                  </td>
                ))}
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Chưa thiết lập lương
              </td> */}
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
export default WeeklyShiftTable;
