import React, { useEffect, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FileIcon,
  ChevronDownIcon,
} from "lucide-react";
import { ScheduleTable } from "../components/Shift/ScheduleTable";
import { AddShiftModal } from "../components/Shift/AddShiftModal";
import { format, addWeeks, subWeeks } from "date-fns";
import Search from "../components/search.jsx";
import { fetchAllNhanVien, searchEmployee } from "../api/apiTaiKhoan.js";
import { deleteDangKyCa, fetchDangKyCa } from "../api/apiDangKyCa.js";
import { fetchCaLam } from "../api/apiCaLam.js";
import { getChiNhanh } from "../api/apiChiNhanh.js";

export const WorkSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  // const [searchQuery, setSearchQuery] = useState("");
  const [viewType, setViewType] = useState("employee");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [chinhanhs, setChiNhanhs] = useState([]);
  const [selectedChiNhanh, setSelectedChiNhanh] = useState("");

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

  const fetchChiNhanh = async () => {
    try {
      const data = await getChiNhanh();
      setChiNhanhs(data);
    } catch (error) {
      console.error("Lỗi khi lấy Nhân viên:", error);
    }
  };

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

  const handleSearch = async (query) => {
    try {
      if (!query.trim()) {
        await getAllNhanVien();
        return;
      }
      const results = await searchEmployee(query);
      setEmployees(results);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    }
  };
  useEffect(() => {
    getAllNhanVien();
    getAllCaLam();
    getAllDangKyCa();
    fetchChiNhanh();
  }, []);

  useEffect(() => {
    let filtered = Array.isArray(employees) ? [...employees] : [];

    // Lọc theo chi nhánh
    if (selectedChiNhanh) {
      filtered = filtered.filter(
        (emp) => emp.MaCN === Number(selectedChiNhanh.MaCN)
      );
    }

    // Lọc theo trạng thái
    // if (statusFilter === "working") {
    //   filtered = filtered.filter((emp) => emp.TrangThai === "Đang làm");
    // } else if (statusFilter === "resigned") {
    //   filtered = filtered.filter((emp) => emp.TrangThai === "Đã nghỉ");
    // }
    setFilteredEmployees(filtered);
  }, [employees, selectedChiNhanh]);

  const handleDeleteShift = async (employee, date, shift) => {
    if (
      window.confirm(
        `Bạn có chắc muốn xoá ca "${shift.TenCa}" của ${employee.HoTen}?`
      )
    ) {
      if (!shift || !shift.MaDKC) {
        alert("Không tìm thấy mã đăng ký ca hợp lệ để xoá.");
        return;
      }
      try {
        const result = await deleteDangKyCa(shift.MaDKC);
        if (!result.success) {
          alert(result.message || "Xóa thang lương thất bại.");
          return;
        }
        await getAllDangKyCa();
      } catch (error) {
        console.error("Lỗi khi xoá ca:", error);
      }
    }
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
              <Search
                placeholder="Tìm kiếm nhân viên..."
                onSearch={handleSearch}
                setQuery={setSearchQuery}
              />
              {/* <CreateInvoice /> */}
            </div>
            <div className="relative">
              <select
                value={selectedChiNhanh.TenCN}
                onChange={(e) => {
                  const selected = chinhanhs?.find(
                    (chinhanh) => chinhanh.TenChiNhanh === e.target.value
                  );
                  setSelectedChiNhanh(selected ?? "");
                }}
                className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Chọn chi nhánh...</option>
                {chinhanhs?.map?.((chinhanh) => (
                  <option key={chinhanh.MaCN} value={chinhanh.TenChiNhanh}>
                    {chinhanh.TenChiNhanh}
                  </option>
                ))}
              </select>
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
        onDeleteShift={handleDeleteShift}
        employees={filteredEmployees}
        onAddShift={handleAddShift}
        schedules={schedules}
      />
      {/* Add Shift Modal */}
      {isModalOpen && (
        <AddShiftModal
          schedules={schedules}
          shifts={shifts}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          employee={selectedEmployee}
          date={selectedDate}
          onSuccess={getAllDangKyCa}
        />
      )}
    </div>
  );
};
