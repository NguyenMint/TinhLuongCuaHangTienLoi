import React from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { vi } from "date-fns/locale";
import { PlusIcon } from "lucide-react";
export const ScheduleTable = ({
  currentDate,
  onAddShift,
  employees,
  onDeleteShift,
  schedules,
}) => {
  const startDate = startOfWeek(currentDate, {
    weekStartsOn: 1,
  });

  const weekDays = Array.from(
    {
      length: 7,
    },
    (_, i) => addDays(startDate, i)
  );

  const formatted = schedules.reduce((acc, employee) => {
    const employeeKey = employee.MaNS;

    if (!acc[employeeKey]) {
      acc[employeeKey] = {};
    }

    if (!acc[employeeKey][employee.NgayDangKy]) {
      acc[employeeKey][employee.NgayDangKy] = [];
    }

    acc[employeeKey][employee.NgayDangKy].push({
      TenCa: employee.MaCaLam_ca_lam.TenCa,
      MaDKC: employee.MaDKC,
    });

    return acc;
  }, {});

  const getShiftForDay = (employeeId, date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return formatted[employeeId]?.[dateKey] || [];
  };

  const renderShift = (employee, date) => {
    const shift = getShiftForDay(employee.MaTK, date);

    return (
      <div className="group relative h-full min-h-[40px] flex items-center">
        {shift.length > 0 ? (
          <div className="space-y-1 w-full">
            {shift.map((shift, index) => (
              <div
                key={index}
                onClick={() => onDeleteShift?.(employee, date, shift)}
                className="p-2 text-xs font-bold rounded w-full bg-blue-50 text-blue-700 text-center cursor-pointer"
              >
                {shift.TenCa}
              </div>
            ))}
            <button
              onClick={() => onAddShift(employee, date)}
              className="flex text-xs items-center text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity  inset-0 justify-center"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              <span>Thêm ca</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => onAddShift(employee, date)}
            className="flex text-xs items-center text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 justify-center"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            <span>Thêm ca</span>
          </button>
        )}
      </div>
    );
  };
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nhân viên
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
          {employees.map((employee) => (
            <tr key={employee.MaTK}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {employee.HoTen}
                  </div>
                  <div className="text-sm text-gray-500">
                    Mã: {employee.MaTK}
                  </div>
                </div>
              </td>
              {weekDays.map((day, index) => (
                <td key={index} className="px-6 py-4 whitespace-nowrap">
                  {renderShift(employee, day)}
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
