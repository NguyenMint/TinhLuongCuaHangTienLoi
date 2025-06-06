import React, { useEffect, useState } from "react";
import AttendanceTable from "../components/attendance/AttendanceTable";
import ShiftModal from "../components/attendance/ShiftModal";
import { fetchAllNhanVien } from "../api/api";
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
  });

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
          dataUpdate.GioRa,
          dataUpdate.GioVao,
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
              <div className="relative">
                <div className="flex items-center border rounded-md px-3 py-2">
                  <input
                    type="text"
                    placeholder="Tìm kiếm nhân viên"
                    className="outline-none w-40 sm:w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="relative">
                <select
                  className="border rounded-md px-3 py-2 appearance-none pr-8 bg-white"
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                >
                  <option>Theo tuần</option>
                  <option>Xem theo ca</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7-7 7-7"
                    ></path>
                  </svg>
                </div>
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
          setDataUpdate={setDataUpdate}
        />
      )}
    </div>
  );
}
