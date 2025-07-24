import React, { useEffect, useState } from "react";
import AttendanceTable from "../components/attendance/AttendanceTable";
import ShiftModal from "../components/attendance/ShiftModal";
import { fetchCaLam } from "../api/apiCaLam";
import { fetchLLVDaDangKy } from "../api/apiLichLamViec.js";
import { addWeeks, format, subWeeks } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { chamCong, update_chamcong, getTimeServer } from "../api/apiChamCong";
import { createKTKL } from "../api/apiKTKL";
import Search from "../components/search.jsx";
import { getChiNhanh } from "../api/apiChiNhanh.js";

export function AttendancePage() {
  const [shifts, setShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lichLamViecs, setLichLamViecs] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [chinhanhs, setChiNhanhs] = useState([]);
  const [selectedChiNhanh, setSelectedChiNhanh] = useState("");
  const [filteredLLVs, setFilteredLLVs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const [dataUpdate, setDataUpdate] = useState({
    GioVao: "",
    MaTK: "",
    GioRa: "",
    MaChamCong: "",
    DiTre: 0,
    VeSom: 0,
    MaLLV: "",
    NgayLam: "",
    violations: [],
    rewards: [],
  });


  const getAllCaLam = async () => {
    try {
      const data = await fetchCaLam();
      setShifts(data);
    } catch (error) {
      console.error("Lỗi khi lấy ca làm:", error);
    }
  };

  const getAllLichLamViec = async () => {
    try {
      const data = await fetchLLVDaDangKy();
      setLichLamViecs(data);
    } catch (error) {
      console.error("Lỗi khi lấy lịch làm việc:", error);
    }
  };

  const fetchChiNhanh = async () => {
    try {
      const data = await getChiNhanh();
      setChiNhanhs(data);
    } catch (error) {
      console.error("Lỗi khi lấy chi nhánh:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    getAllCaLam();
    getAllLichLamViec();
    fetchChiNhanh();
    setLoading(false);
  }, []);

  const handlePreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const handleThisWeek = async () => {
    try {
      setCurrentDate(new Date());
    } catch (error) {
      console.log("Lỗi khi lấy thời gian server: ", error);
      setCurrentDate(new Date());
    }
  };

  const handleShiftClick = (shift) => {
    setSelectedShift(shift);
    setIsModalOpen(true);
  };

  useEffect(() => {
    let filtered = Array.isArray(lichLamViecs) ? [...lichLamViecs] : [];

    if (user.MaVaiTro === 1) {
      filtered = filtered.filter(
        (emp) => emp.MaTK_tai_khoan.MaCN === Number(user.MaCN)
      );
    } else if (selectedChiNhanh) {
      filtered = filtered.filter(
        (emp) => emp.MaTK_tai_khoan.MaCN === Number(selectedChiNhanh.MaCN)
      );
    }
    if (searchQuery.trim() !== "") {
      const lowerSearch = searchQuery.toLowerCase();
      filtered = filtered.filter((emp) =>
        emp.MaTK_tai_khoan?.HoTen?.toLowerCase().includes(lowerSearch)
      );
    }
    setFilteredLLVs(filtered);
  }, [selectedChiNhanh, lichLamViecs, searchQuery]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setDataUpdate({
      GioVao: "",
      MaTK: "",
      GioRa: "",
      MaChamCong: "",
      DiTre: 0,
      VeSom: 0,
      MaLLV: "",
      NgayLam: "",
      violations: [],
      rewards: [],
    });
  };

  const handleSaveShift = async (formData) => {
    try {
      const records = [
        ...(dataUpdate.violations || []).map((violation) => ({
          MaLLV: dataUpdate.MaLLV,
          ThuongPhat: 0,
          LyDo: violation.LyDo,
          MucThuongPhat: violation.MucThuongPhat,
          DuocMienThue: violation.DuocMienThue ? 1 : 0,
          MaTK: dataUpdate.MaTK,
        })),
        ...(dataUpdate.rewards || []).map((reward) => ({
          MaLLV: dataUpdate.MaLLV,
          ThuongPhat: 1,
          LyDo: reward.LyDo,
          MucThuongPhat: reward.MucThuongPhat,
          DuocMienThue: reward.DuocMienThue ? 1 : 0,
          MaTK: dataUpdate.MaTK,
        })),
      ];

      if (records.length > 0) {
        const results = await Promise.all(
          records.map((record) => createKTKL(record))
        );
        const failedRecords = results.filter((res) => !res.success);
        if (failedRecords.length > 0) {
          console.warn("Một số bản ghi bị lỗi:", failedRecords);
          alert(
            `Chấm công đã được lưu, nhưng có ${failedRecords.length} bản ghi khen thưởng/vi phạm bị lỗi.`
          );
        }
      }
      console.log(dataUpdate);
      await update_chamcong(
        dataUpdate.GioVao,
        dataUpdate.GioRa,
        dataUpdate.DiTre,
        dataUpdate.VeSom,
        dataUpdate.MaChamCong,
        dataUpdate.NgayLam,
        dataUpdate.MaLLV
      );

      await getAllLichLamViec();
      setIsModalOpen(false);
      alert("Đã duyệt chấm công thành công!");
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
      alert(`Lỗi khi lưu dữ liệu: ${error.message || "Lỗi không xác định"}`);
    }
  };

  const handleDeleteShift = (shiftId) => {
    setShifts(shifts.filter((shift) => shift.id !== shiftId));
    setIsModalOpen(false);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <span>Đang tải dữ liệu...</span>
      </div>
    );
  }

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
                <Search
                  placeholder="Tìm kiếm nhân viên..."
                  onSearch={setSearchQuery}
                  setQuery={setSearchQuery}
                />
              </div>
              {user.MaVaiTro === 3 && (
                <div className="relative">
                  <select
                    value={selectedChiNhanh.TenChiNhanh || ""}
                    onChange={(e) => {
                      const selected = chinhanhs?.find(
                        (chinhanh) => chinhanh.TenChiNhanh === e.target.value
                      );
                      setSelectedChiNhanh(selected || "");
                    }}
                    className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Chọn chi nhánh...</option>
                    {chinhanhs?.map((chinhanh) => (
                      <option key={chinhanh.MaCN} value={chinhanh.TenChiNhanh}>
                        {chinhanh.TenChiNhanh}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-4">
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
          <AttendanceTable
            currentDate={currentDate}
            shifts={shifts}
            lichLamViecs={filteredLLVs}
            onShiftClick={handleShiftClick}
          />
        </div>
      </div>
      {isModalOpen && selectedShift && (
        <ShiftModal
          shift={selectedShift}
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

export default AttendancePage;
