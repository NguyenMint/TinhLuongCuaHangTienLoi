import React, { useEffect, useState } from "react";
import { FilterSidebar } from "../components/Payroll/FilterSidebar";
import { PayrollTable } from "../components/Payroll/PayrollTable";
import { PayrollDetail } from "../components/Payroll/PayrollDetail";
import { Header } from "../components/Payroll/Header";
import {
  createBangLuong,
  deleteBangLuong,
  getAllBangLuong,
  getBLByCN,
  getPLByKyLuong,
  getBLTotal,
  getKyLuong,
  getPLByKyLuongCN,
} from "../api/apiBangLuong";
import { getChiNhanh } from "../api/apiChiNhanh";
import { CreatePayrollModal } from "../components/Payroll/CreatePayrollModal";
import { fetchAllNhanVien } from "../api/apiTaiKhoan";
import { Pagination } from "../components/Pagination";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { formatCurrency } from "../utils/format";
export function PayrollPage() {
  // State variables
  const [payrolls, setPayrolls] = useState([]);
  const [filteredPayrolls, setFilteredPayrolls] = useState([]);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [chinhanhs, setChiNhanhs] = useState([]);
  const [selectedChiNhanh, setSelectedChiNhanh] = useState("Tổng hợp");
  const [showCreatePayroll, setShowCreatePayroll] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [kyLuongs, setKyLuongs] = useState([]);
  const [selectedKyLuong, setSelectedKyLuong] = useState("");
  const [bangLuongs, setBangLuongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [phieuLuongs, setPhieuLuongs] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const payrollInPage = 5;
  const indexLast = currentPage * payrollInPage;
  const indexFirst = indexLast - payrollInPage;
  const payrollCurrent = filteredPayrolls.slice(indexFirst, indexLast);
  const totalPage = Math.ceil(filteredPayrolls.length / payrollInPage);

  // Status filters
  const [statusFilters, setStatusFilters] = useState({
    creating: false,
    draft: false,
    finalized: false,
    cancelled: false,
  });

  // API Functions
  const getAllNhanVien = async () => {
    try {
      setLoading(true);
      const data = await fetchAllNhanVien();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi khi lấy Nhân viên:", error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchKyLuong = async () => {
    try {
      const data = await getKyLuong();
      setKyLuongs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi khi lấy Kỳ lương:", error);
      setKyLuongs([]);
    }
  };

  const fetchAllBangLuong = async () => {
    try {
      const data = await getAllBangLuong();
      setPayrolls(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi khi lấy Bảng lương:", error);
      setPayrolls([]);
    }
  };

  const fetchChiNhanh = async () => {
    try {
      const data = await getChiNhanh();
      setChiNhanhs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi khi lấy Chi nhánh:", error);
      setChiNhanhs([]);
    }
  };
  const fetchPhieuLuongs = async (chiNhanh = selectedChiNhanh, kyLuong) => {
    try {
      let data = [];

      if (user.MaVaiTro === 1) {
        data = await getPLByKyLuongCN(kyLuong, user.MaCN);
      } else if (chiNhanh === "Tổng hợp") {
        data = await getPLByKyLuong(kyLuong);
      } else {
        data = await getPLByKyLuongCN(kyLuong, chiNhanh.MaCN);
      }
      setPhieuLuongs(Array.isArray(data.employees) ? data : []);
    } catch (error) {
      console.error("Lỗi khi lấy Bảng Lương:", error);
      setPhieuLuongs([]);
    }
  };
  const fetchBLByCN = async (chiNhanh = selectedChiNhanh) => {
    try {
      let data = [];
      if (user.MaVaiTro === 1) {
        data = await getBLByCN(user.MaCN);
      } else if (chiNhanh === "Tổng hợp") {
        data = await getBLTotal();
      } else {
        data = await getBLByCN(chiNhanh.MaCN);
      }
      setBangLuongs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi khi lấy BL:", error);
      setBangLuongs([]);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        fetchAllBangLuong(),
        fetchChiNhanh(),
        getAllNhanVien(),
        fetchKyLuong(),
        fetchBLByCN(),
      ]);
    };

    initializeData();
  }, []);

  // Fetch BL when selected chi nhánh changes
  useEffect(() => {
    if (selectedChiNhanh !== undefined) {
      fetchBLByCN(selectedChiNhanh);
      if (selectedPayroll) {
        fetchPhieuLuongs(selectedChiNhanh, selectedPayroll.KyLuong);
      }
    }
  }, [selectedChiNhanh]);

  useEffect(() => {
    if (selectedPayroll) {
      fetchPhieuLuongs(selectedChiNhanh, selectedPayroll.KyLuong);
    }
  }, [selectedPayroll]);

  // Filter
  useEffect(() => {
    let filtered = Array.isArray(bangLuongs) ? [...bangLuongs] : [];

    // Filter by kỳ lương
    if (selectedKyLuong) {
      filtered = filtered.filter((emp) => emp?.KyLuong === selectedKyLuong);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (emp) =>
          emp?.MaTK_tai_khoan?.HoTen?.toLowerCase()?.includes(
            searchTerm.toLowerCase()
          ) || emp?.MaTK_tai_khoan?.MaTK?.toString()?.includes(searchTerm)
      );
    }

    // Filter by status
    const activeStatuses = Object.keys(statusFilters).filter(
      (key) => statusFilters[key]
    );
    if (activeStatuses.length > 0) {
      filtered = filtered.filter((emp) => {
        const status = emp?.TrangThai?.toLowerCase();
        return activeStatuses.some((filterStatus) => {
          switch (filterStatus) {
            case "creating":
              return status === "đang tạo";
            case "draft":
              return status === "tạm tính";
            case "finalized":
              return status === "đã chốt lương";
            case "cancelled":
              return status === "đã hủy";
            default:
              return false;
          }
        });
      });
    }

    setFilteredPayrolls(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    bangLuongs,
    selectedChiNhanh,
    selectedKyLuong,
    searchTerm,
    statusFilters,
  ]);

  // Event handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRowClick = (payroll) => {
    setSelectedPayroll(payroll);
  };

  const handleDelete = async (KyLuong) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy bảng lương này?")) {
      await deleteBangLuong(KyLuong);
      alert("Bảng lương đã được hủy");
      await fetchAllBangLuong();
      await fetchBLByCN();
      setShowDetail(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleStatusFilterChange = (status, checked) => {
    setStatusFilters((prev) => ({
      ...prev,
      [status]: checked,
    }));
  };

  const handleCreatePayrollModal = async (form) => {
    if (!form.Thang || !form.Nam) {
      alert("Vui lòng nhập đầy đủ tháng và năm.");
      return;
    }
    try {
      setLoading(true);
      const result = await createBangLuong(form);
      if (result) {
        await fetchAllBangLuong();
        await fetchBLByCN();
      }
      setShowCreatePayroll(false);
      setSelectedEmployees([]);
    } catch (error) {
      alert("Có lỗi xảy ra khi tạo bảng lương!");
      console.error("Error creating payroll:", error);
    } finally {
      setLoading(false);
    }
  };
  const closeDetailModal = () => {
    setShowDetail(false);
    setSelectedPayroll(null);
  };
  return (
    <div className="flex h-screen bg-gray-50">
      <FilterSidebar
        kyLuongs={kyLuongs}
        chinhanhs={chinhanhs}
        selectedChiNhanh={selectedChiNhanh}
        statusFilters={statusFilters}
        onStatusFilterChange={handleStatusFilterChange}
        setSelectedKyLuong={setSelectedKyLuong}
        setSelectedChiNhanh={setSelectedChiNhanh}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          onSearch={handleSearch}
          setShowCreatePayroll={setShowCreatePayroll}
          loading={loading}
        />

        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg">Đang tải dữ liệu...</div>
            </div>
          ) : (
            <>
              <PayrollTable
                payrolls={payrollCurrent}
                onRowClick={handleRowClick}
                selectedPayroll={selectedPayroll}
                setSelectedPayroll={setSelectedPayroll}
                setShowDetail={setShowDetail}
              />

              {filteredPayrolls.length > payrollInPage && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPage}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}

          {showCreatePayroll && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
                <CreatePayrollModal
                  onSave={handleCreatePayrollModal}
                  setShowCreatePayroll={setShowCreatePayroll}
                />
              </div>
            </div>
          )}

          {showDetail && selectedPayroll && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full mx-4 max-h-[90vh] overflow-auto">
                <PayrollDetail
                  phieuLuongs={phieuLuongs}
                  payroll={selectedPayroll}
                  onDelete={handleDelete}
                  closeDetailModal={closeDetailModal}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
