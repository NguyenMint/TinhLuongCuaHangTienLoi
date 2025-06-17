import React, { useEffect, useState } from "react";
import ApproveTable from "../components/ApproveShift/ApproveTable";
import { fetchCaLam } from "../api/apiCaLam";
import { fetchLichLamViec, updateLLV } from "../api/apiLichLamViec.js";
import { addWeeks, format, set, subWeeks } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon, FileIcon } from "lucide-react";
import Search from "../components/search.jsx";
import { getChiNhanh } from "../api/apiChiNhanh.js";
import ApproveModal from "../components/ApproveShift/ApproveModal.jsx";

export function ShiftRequests() {
  const [shifts, setShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [luongTheoGio, setLuongTheoGio] = useState(0);
  const [isLoadingForLuong, setisLoadingForLuong] = useState(false);
  // const [viewMode, setViewMode] = useState("Xem theo ca");
  // const [searchQuery, setSearchQuery] = useState("");
  const [dangKyCas, setDangKyCas] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  // const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [chinhanhs, setChiNhanhs] = useState([]);

  const [selectedChiNhanh, setSelectedChiNhanh] = useState("");
  const [filteredDKCs, setFilteredDKCs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [dataUpdate, setDataUpdate] = useState({
    GioVao: "",
    MaTK: "",
    GioRa: "",
    MaChamCong: "",
    DiTre: 0,
    RaSom: 0,
    MaLLV: "",
    NgayLam: "",
    violations: [],
    rewards: [],
  });

  // console.log(dataUpdate);

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
      const data = await fetchLichLamViec();
      setDangKyCas(data);
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
  useEffect(() => {
    getAllCaLam();
    getAllDangKyCa();
    fetchChiNhanh();
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

  useEffect(() => {
    let filtered = Array.isArray(dangKyCas) ? [...dangKyCas] : [];

    // Lọc theo chi nhánh
    if (selectedChiNhanh) {
      filtered = filtered.filter(
        (emp) => emp.MaNS_tai_khoan.MaCN === Number(selectedChiNhanh.MaCN)
      );
    }

    // Lọc theo từ khóa tìm kiếm (theo họ tên)
    if (searchQuery.trim() !== "") {
      const lowerSearch = searchQuery.toLowerCase();
      filtered = filtered.filter((emp) =>
        emp.MaNS_tai_khoan?.HoTen?.toLowerCase().includes(lowerSearch)
      );
    }

    setFilteredDKCs(filtered);
  }, [selectedChiNhanh, dangKyCas, searchQuery]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setLuongTheoGio(0);
    setisLoadingForLuong(false);
  };

  const handleSaveShift = async (MaLLV) => {
    try {
      await updateLLV(MaLLV, "Đã Đăng Ký");
      await getAllDangKyCa();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);

      const errorMessage = error.message || "Lỗi không xác định";
      alert(`Lỗi khi lưu dữ liệu: ${errorMessage}`);
    }
  };

  const handleDeleteShift = async (MaLLV) => {
    try {
      await updateLLV(MaLLV, "Từ chối");
      await getAllDangKyCa();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);

      const errorMessage = error.message || "Lỗi không xác định";
      alert(`Lỗi khi lưu dữ liệu: ${errorMessage}`);
    }
  };

  const weekNumber = Math.ceil(currentDate.getDate() / 7);
  const monthYear = format(currentDate, "MM.yyyy");
  const weekLabel = `Tuần ${weekNumber} - Th.${monthYear}`;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Bảng Đăng ký ca</h1>
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
                </div>
              </div>
            </div>
          </div>
          <ApproveTable
            currentDate={currentDate}
            shifts={shifts}
            dangKyCas={filteredDKCs}
            onShiftClick={handleShiftClick}
          />
        </div>
      </div>
      {isModalOpen && selectedShift && (
        <ApproveModal
          luongTheoGio={luongTheoGio}
          isLoadingForLuong={isLoadingForLuong}
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
