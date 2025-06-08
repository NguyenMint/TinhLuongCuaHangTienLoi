import React, { useEffect, useState } from "react";
import AttendanceTable from "../components/attendance/AttendanceTable";
import ShiftModal from "../components/attendance/ShiftModal";
import { fetchAllNhanVien } from "../api/apiTaiKhoan";
import { fetchCaLam } from "../api/apiCaLam";
import { fetchDangKyCa, fetchDKCByNhanVien } from "../api/apiDangKyCa";
import { addWeeks, format, subWeeks } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon, FileIcon } from "lucide-react";
import { chamCong, update_chamcong } from "../api/apiChamCong";

export function AttendancePage() {
  const [shifts, setShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("Xem theo ca");
  const [searchQuery, setSearchQuery] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [dataUpdate, setDataUpdate] = useState({
    GioVao: "",
    GioRa: "",
    MaChamCong: "",
    DiTre: 0,
    RaSom: 0,
    MaDKC: "",
    NgayDangKy: "",
    violations: [],
    rewards: [],
  });
console.log(dataUpdate);

  const getAllCaLam = async () => {
    try {
      const data = await fetchCaLam();
      setShifts(data);
    } catch (error) {
      console.error("Lỗi khi lấy Nhân viên:", error);
    }
  };

  const getAllDangKyCa = async () => {
    try {
      const data = await fetchDangKyCa();
      setSchedules(data);
    } catch (error) {
      console.error("Lỗi khi lấy Nhân viên:", error);
    }
  };

  useEffect(() => {
    getAllCaLam();
    getAllDangKyCa();
  }, []);

  const handlePreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };
  const handleNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };
  const handleThisWeek = () => {
    setCurrentDate(new Date());
  };

  const handleShiftClick = (shift) => {
    setSelectedShift(shift);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const fetchNV = async (ma, ngay) => {
    const response = await fetchDKCByNhanVien(ma, ngay);
    return response;
  };

  const handleSaveShift = async (updatedShift) => {
    if (!!dataUpdate.MaChamCong) {
      try {
        await update_chamcong(
          dataUpdate.GioVao,
          dataUpdate.GioRa,
          dataUpdate.DiTre,
          dataUpdate.VeSom,
          dataUpdate.MaChamCong
        );
      } catch (error) {
        console.error("Lỗi khi tạo mới bản ghi chấm công:", error);
      }
    } else {
      try {
        await chamCong(
          dataUpdate.NgayDangKy,
          dataUpdate.GioVao,
          dataUpdate.GioRa,
          dataUpdate.MaDKC,
          false
        );
      } catch (error) {
        console.error("Lỗi khi tạo mới bản ghi chấm công:", error);
      }
    }

    await getAllDangKyCa();

    setIsModalOpen(false);
  };

  const handleDeleteShift = (shiftId) => {
    setShifts(shifts.filter((shift) => shift.id !== shiftId));
    setIsModalOpen(false);
  };

  const weekNumber = Math.ceil(currentDate.getDate() / 7);
  const monthYear = format(currentDate, "MM.yyyy");
  const weekLabel = `Tuần ${weekNumber} - Th.${monthYear}`;
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Bảng chấm công</h1>
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 flex flex-wrap items-center justify-between border-b">
            <div className="flex items-center space-x-2 mb-2 sm:mb-0">
              <div className="relative">{/* Thêm search vô đây */}</div>
              <div className="relative">
                {/* Lọc nhân viên: Theo chi nhánh hoặc là theo nhân viên */}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {/* Week Navigation */}
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
                    <span className="text-sm text-gray-600 ml-2">
                      {weekLabel}
                    </span>
                  </div>
                  <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                    <FileIcon className="h-4 w-4 mr-2" />
                    Xuất file
                  </button>
                </div>
              </div>
            </div>
          </div>
          <AttendanceTable
            currentDate={currentDate}
            shifts={shifts}
            schedules={schedules}
            onShiftClick={handleShiftClick}
          />
        </div>
      </div>
      {isModalOpen && selectedShift && (
        <ShiftModal
          shift={selectedShift}
          // setDataUpdate={setDataUpdate}
          employee={selectedEmployee}
          onClose={handleCloseModal}
          onSave={handleSaveShift}
          onDelete={handleDeleteShift}
          dataUpdate={dataUpdate}
          setDataUpdate={setDataUpdate}
        />
      )}
    </div>
  );
}
