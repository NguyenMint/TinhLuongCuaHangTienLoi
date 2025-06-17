import React, { useEffect, useState } from "react";
import { XIcon, PlusIcon } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Shift from "./Shift";
import { createLLV } from "../../api/apiLichLamViec";
export const AddShiftModal = ({
  isOpen,
  onClose,
  employee,
  date,
  shifts,
  onSuccess,
  schedules,
}) => {
  // console.log(date);
  // console.log(employee);
  const [selectedShifts, setSelectedShifts] = useState({});
  const [repeatWeekly, setRepeatWeekly] = useState(false);
  const [applyToOthers, setApplyToOthers] = useState(false);
  const [availableShifts, setavailableShifts] = useState([]);

  useEffect(() => {
    if (schedules && employee) {
      const employeeSchedules = schedules.filter(
        (schedule) =>
          schedule.MaNS === employee.MaTK &&
          format(date, "yyyy-MM-dd") ===
            format(new Date(schedule.NgayLam), "yyyy-MM-dd")
      );
      const scheduledShiftIds = employeeSchedules.map((s) => s.MaCaLam);

      const availShifts = shifts.filter(
        (shift) => !scheduledShiftIds.includes(shift.MaCa)
      );
      setavailableShifts(availShifts);
    }
  }, [schedules, employee]);

  const handleSubmit = async () => {
    try {
      console.log({
        employee,
        date,
        selectedShifts,
        repeatWeekly,
        applyToOthers,
      });

      const selectedShiftIds = Object.keys(selectedShifts).filter(
        (key) => selectedShifts[key]
      );

      if (selectedShiftIds.length === 0) {
        alert("Vui lòng chọn ít nhất một ca làm việc.");
        return;
      }

      const requests = selectedShiftIds.map((MaCaLam) => {
        const formData = {
          MaTK: employee.MaTK,
          NgayLam: format(date, "yyyy-MM-dd"),
          MaCaLam: MaCaLam,
          TrangThai: "Đã đăng ký",
        };
        createLLV(formData);
      });
      await Promise.all(requests);
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error submitting shift:", error);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Thêm lịch làm việc
            </h3>
            <p className="text-sm text-gray-500">
              {employee?.name} -{" "}
              {format(date, "EEEE, dd/MM/yyyy", {
                locale: vi,
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Shifts Section */}

          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-medium text-gray-900">
                Chọn ca làm việc
              </h4>
              <button className="text-blue-600 hover:text-blue-700">
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Shift
                shifts={availableShifts}
                setSelectedShifts={setSelectedShifts}
                selectedShifts={selectedShifts}
              />
            </div>
          </div>
          {/* Toggles Section */}
          <div className="space-y-4">
            <div>
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-900 block">
                    Lặp lại hàng tuần
                  </span>
                  <span className="text-sm text-gray-500 block">
                    Ca làm việc sẽ được tự động lặp lại vào cùng ngày trong
                    tuần.
                  </span>
                </div>
                <button
                  onClick={() => setRepeatWeekly(!repeatWeekly)}
                  className={`${
                    repeatWeekly ? "bg-blue-600" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
                >
                  <span
                    className={`${
                      repeatWeekly ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                  />
                </button>
              </label>
            </div>
            <div>
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-900 block">
                    Áp dụng cho nhân viên khác
                  </span>
                  <span className="text-sm text-gray-500 block">
                    Ca làm việc sẽ được áp dụng cho các nhân viên được chọn.
                  </span>
                </div>
                <button
                  onClick={() => setApplyToOthers(!applyToOthers)}
                  className={`${
                    applyToOthers ? "bg-blue-600" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
                >
                  <span
                    className={`${
                      applyToOthers ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                  />
                </button>
              </label>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-500 hover:bg-green-600"
          >
            Xong
          </button>
        </div>
      </div>
    </div>
  );
};
