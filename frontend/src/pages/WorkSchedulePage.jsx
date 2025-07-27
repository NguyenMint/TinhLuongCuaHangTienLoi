import React, { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, BellIcon } from "lucide-react";
import { ScheduleTable } from "../components/Shift/ScheduleTable";
import { AddShiftModal } from "../components/Shift/AddShiftModal";
import { format, addWeeks, subWeeks, isBefore, startOfDay } from "date-fns";
import Search from "../components/search.jsx";
import { fetchAllNhanVien, searchEmployee } from "../api/apiTaiKhoan.js";
import {
  deleteLichLamViec,
  fetchLichLamViec,
  createLLV,
} from "../api/apiLichLamViec.js";
import { fetchCaLam } from "../api/apiCaLam.js";
import { getChiNhanh } from "../api/apiChiNhanh.js";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export const WorkSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [chinhanhs, setChiNhanhs] = useState([]);
  const [selectedChiNhanh, setSelectedChiNhanh] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

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
      console.error("Lỗi khi lấy Ca làm:", error);
    }
  };

  const getAllLichLamViec = async () => {
    try {
      const data = await fetchLichLamViec();
      const approvedSchedules = data.filter(
        (schedule) => schedule.TrangThai === "Đã Đăng Ký"
      );
      setSchedules(approvedSchedules);

      const pending = data.filter(
        (schedule) => schedule.TrangThai === "Chờ Xác Nhận"
      );
      setPendingRequests(pending);
    } catch (error) {
      console.error("Lỗi khi lấy Đăng ký ca:", error);
    }
  };

  const fetchChiNhanh = async () => {
    try {
      const data = await getChiNhanh();
      setChiNhanhs(data);
    } catch (error) {
      console.error("Lỗi khi lấy Chi nhánh:", error);
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
    // Check if the date is in the past
    const today = startOfDay(new Date());
    const selectedDate = startOfDay(new Date(date));

    if (isBefore(selectedDate, today)) {
      toast.warning("Không thể thêm ca làm việc cho ngày đã qua.");
      return;
    }

    setSelectedEmployee(employee);
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleModalClose = async () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
    setSelectedDate(null);
  };

  // Moved submit function to parent component
  const handleSubmitShift = async (selectedShifts) => {
    try {
      const selectedShiftIds = Object.keys(selectedShifts).filter(
        (key) => selectedShifts[key]
      );

      if (selectedShiftIds.length === 0) {
        toast.warning("Vui lòng chọn ít nhất một ca làm việc.");
        return;
      }

      const requests = selectedShiftIds.map(async (MaCaLam) => {
        const formData = {
          MaTK: selectedEmployee.MaTK,
          NgayLam: format(selectedDate, "yyyy-MM-dd"),
          MaCaLam: MaCaLam,
          TrangThai: "Đã Đăng Ký",
        };
        return await createLLV(formData);
      });

      const results = await Promise.all(requests);

      const hasErrors = results.some((result) => result.message);
      if (hasErrors) {
        toast.error("Có lỗi xảy ra khi thêm ca làm việc. Vui lòng thử lại.");
        return;
      }
      toast.success("Thêm ca làm việc thành công!");
      // Refresh data and close modal
      await getAllLichLamViec();
      handleModalClose();
    } catch (error) {
      console.error("Error submitting shift:", error);
      toast.error("Có lỗi xảy ra khi thêm ca làm việc. Vui lòng thử lại.");
    }
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
    getAllLichLamViec();
    fetchChiNhanh();
  }, []);

  useEffect(() => {
    let filtered = Array.isArray(employees) ? [...employees] : [];

    // Lọc theo chi nhánh
    if (user.MaVaiTro === 1) {
      filtered = filtered.filter((emp) => emp.MaCN === Number(user.MaCN));
    } else {
      // Lọc theo chi nhánh
      if (selectedChiNhanh) {
        filtered = filtered.filter(
          (emp) => emp.MaCN === Number(selectedChiNhanh.MaCN)
        );
      }
    }
    setFilteredEmployees(filtered);
  }, [employees, selectedChiNhanh, user.MaCN, user.MaVaiTro, searchEmployee]);

  const handleDeleteShift = async (employee, date, shift) => {
    if (
      window.confirm(
        `Bạn có chắc muốn xoá ca "${shift.TenCa}" của ${employee.HoTen}?`
      )
    ) {
      if (!shift || !shift.MaLLV) {
        toast.warning("Không tìm thấy mã đăng ký ca hợp lệ để xoá.");
        return;
      }
      try {
        const result = await deleteLichLamViec(shift.MaLLV);
        if (!result.success) {
          toast.error(result.message || "Xóa ca làm thất bại.");
          return;
        }
        toast.success("Xoá ca làm việc thành công!");
        await getAllLichLamViec();
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
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Lịch làm việc</h1>

          {/* Notification về đăng ký chờ duyệt */}
          {pendingRequests.length > 0 && (
            <Link
              to="/dang-ky-ca"
              className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              <BellIcon className="h-4 w-4 mr-2" />
              {pendingRequests.length} đăng ký chờ duyệt
            </Link>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          {/* Search and View Type */}
          <div className="flex flex-1 max-w-xl space-x-4">
            <div className="relative flex-1">
              <Search
                placeholder="Tìm kiếm nhân viên..."
                onSearch={handleSearch}
                setQuery={setSearchQuery}
              />
            </div>

            {user.MaVaiTro === 3 && (
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
            )}
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
          onSubmit={handleSubmitShift}
        />
      )}
    </div>
  );
};
