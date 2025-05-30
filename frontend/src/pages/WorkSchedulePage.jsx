import React, { useEffect, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  FileIcon,
  ChevronDownIcon,
} from "lucide-react";
import { ScheduleTable } from "../components/Shift/ScheduleTable";
import { AddShiftModal } from "../components/Shift/AddShiftModal";
import { format, addWeeks, subWeeks } from "date-fns";
// import { vi } from "date-fns/locale";
import { fetchAllNhanVien, fetchCaLam, fetchDangKyCa } from "../api";
export const WorkSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [viewType, setViewType] = useState("employee");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const [employees, setEmployees] = useState([]);

  const getAllNhanVien = async () => {
    try {
      const data = await fetchAllNhanVien();
      setEmployees(data);
    } catch (error) {
      console.error("Lỗi khi lấy Nhân viên:", error);
    }
  };

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
    getAllNhanVien();
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
  const handleAddShift = (employee, date) => {
    setSelectedEmployee(employee);
    setSelectedDate(date);
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
    setSelectedDate(null);
  };
  const weekNumber = Math.ceil(currentDate.getDate() / 7);
  const monthYear = format(currentDate, "MM.yyyy");
  const weekLabel = `Tuần ${weekNumber} - Th.${monthYear}`;
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Lịch làm việc</h1>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          {/* Search and View Type */}
          <div className="flex flex-1 max-w-xl space-x-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm nhân viên"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <select
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}
                className="appearance-none w-48 pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="employee">Xem theo nhân viên</option>
                <option value="department">Xem theo phòng ban</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
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
              <span className="text-sm text-gray-600 ml-2">{weekLabel}</span>
            </div>
            <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
              <FileIcon className="h-4 w-4 mr-2" />
              Xuất file
            </button>
          </div>
        </div>
      </div>
      {/* Schedule Table */}
      <ScheduleTable
        currentDate={currentDate}
        employees={employees}
        onAddShift={handleAddShift}
        schedules={schedules}
      />
      {/* Add Shift Modal */}
      {isModalOpen && (
        <AddShiftModal
          shifts={shifts}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          employee={selectedEmployee}
          date={selectedDate}
        />
      )}
    </div>
  );
};
