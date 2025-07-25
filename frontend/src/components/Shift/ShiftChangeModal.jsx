import React, { useState } from "react";
import { endOfWeek, addDays, format } from "date-fns";
import { vi } from "date-fns/locale";
import { X } from "lucide-react";

export function ShiftChangeModal({
  shift,
  setShowLichLamViec,
  handleXinChuyenCa,
}) {
  const currentDate = new Date();
  const [selectedMaCa, setSelectedMaCa] = useState(shift[0].MaCa);
  const [selectedDate, setSelectedDate] = useState(currentDate);

  const endDate = endOfWeek(currentDate, {
    weekStartsOn: 1,
  });

  const days = [];
  let current = currentDate;

  while (current <= endDate) {
    days.push(current);
    current = addDays(current, 1);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-gray-50 rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Xin chuyển ca</h2>
          <button
            onClick={() => setShowLichLamViec(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Shift Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Ca làm việc
            </label>
            <select
              value={selectedMaCa}
              onChange={(e) => setSelectedMaCa(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-700"
            >
              {shift.map((s) => (
                <option key={s.MaCa} value={s.MaCa}>
                  {s.TenCa}
                </option>
              ))}
            </select>
          </div>

          <select
            value={format(selectedDate, "yyyy-MM-dd")}
            onChange={(e) => {
              setSelectedDate(new Date(e.target.value));
            }}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-700"
          >
            {days.map((day) => (
              <option key={day.toISOString()} value={format(day, "yyyy-MM-dd")}>
                {format(day, "EEEE", { locale: vi })} -{" "}
                {format(day, "dd/MM/yyyy")}
              </option>
            ))}
          </select>
        </div>

        {/* Footer */}
        <div className="bg-white px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={() => setShowLichLamViec(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={() => handleXinChuyenCa(selectedMaCa, selectedDate)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
