import React, { useEffect, useState } from "react";
import { FilterSidebar } from "../components/Payroll/FilterSidebar";
import { PayrollTable } from "../components/Payroll/PayrollTable";
import { PayrollDetail } from "../components/Payroll/PayrollDetail";
import { Header } from "../components/Payroll/Header";
import { payrolls } from "../utils/mockData";
import {
  createBangLuong,
  getAllBangLuong,
  getKyLuong,
} from "../api/apiBangLuong";
import { getChiNhanh } from "../api/apiChiNhanh";
import { EmployeeDetail } from "../components/HomePage/EmployeeDetail";
import { CreatePayrollModal } from "../components/Payroll/CreatePayrollModal";
import { fetchAllNhanVien } from "../api/apiTaiKhoan";
import { Pagination } from "../components/Pagination";
export function PayrollPage() {
  const [payrolls, setPayrolls] = useState([]);
  const [filteredPayrolls, setfilteredPayrolls] = useState([]);

  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [chinhanhs, setChiNhanhs] = useState([]);
  const [selectedChiNhanh, setSelectedChiNhanh] = useState("");
  const [showCreatePayroll, setShowCreatePayroll] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [kyLuongs, setKyLuongs] = useState([]);
  const [selectedKyLuong, setSelectedKyLuong] = useState();

  const [currentPage, setCurrentPage] = useState(1);
  const payrollInPage = 5;
  const indexLast = currentPage * payrollInPage;
  const indexFirst = indexLast - payrollInPage;
  const payrollCurrent = filteredPayrolls.slice(indexFirst, indexLast);
  const totalPage = Math.ceil(filteredPayrolls.length / payrollInPage);
  const handlePageChange = (pagenumber) => {
    setCurrentPage(pagenumber);
  };

  const [statusFilters, setStatusFilters] = useState({
    creating: false,
    draft: false,
    finalized: false,
    cancelled: false,
  });

  const getAllNhanVien = async () => {
    try {
      const data = await fetchAllNhanVien();
      setEmployees(data);
    } catch (error) {
      console.error("Lỗi khi lấy Nhân viên:", error);
    }
  };
  const fetKyLuong = async () => {
    try {
      const data = await getKyLuong();
      setKyLuongs(data);
    } catch (error) {
      console.error("Lỗi khi lấy Nhân viên:", error);
    }
  };
  const fetchAllBangLuong = async () => {
    try {
      const data = await getAllBangLuong();
      setPayrolls(data);
    } catch (error) {
      console.error("Lỗi khi lấy Bảng lương:", error);
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
    fetchAllBangLuong();
    fetchChiNhanh();
    getAllNhanVien();
    fetKyLuong();
  }, []);

  // Handle search
  // useEffect(() => {
  //   const filtered = payrolls.filter((payroll) =>
  //     payroll.name.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  //   setFilteredPayrolls(filtered);
  // }, [searchTerm]);
  // Handle status filter
  // useEffect(() => {
  //   const filtered = payrolls.filter((payroll) => {
  //     if (payroll.status === "Đã chốt lương" && statusFilters.finalized)
  //       return true;
  //     if (payroll.status === "Tạm tính" && statusFilters.draft) return true;
  //     if (payroll.status === "Đang tạo" && statusFilters.creating) return true;
  //     if (payroll.status === "Đã hủy" && statusFilters.cancelled) return true;
  //     return false;
  //   });
  //   setFilteredPayrolls(filtered);
  // }, [statusFilters]);

  useEffect(() => {
    let filtered = Array.isArray(payrolls) ? [...payrolls] : [];
    // console.log(selectedChiNhanh);

    if (selectedChiNhanh) {
      filtered = filtered.filter(
        (emp) => emp.MaTK_tai_khoan.MaCN === Number(selectedChiNhanh.MaCN)
      );
    }

    // Lọc theo chi nhánh
    if (selectedKyLuong) {
      filtered = filtered.filter((emp) => emp.KyLuong === selectedKyLuong);
    }
    // // Lọc theo trạng thái
    // if (statusFilter === "working") {
    //   filtered = filtered.filter((emp) => emp.TrangThai === "Đang làm");
    // } else if (statusFilter === "resigned") {
    //   filtered = filtered.filter((emp) => emp.TrangThai === "Đã nghỉ");
    // }
    setfilteredPayrolls(filtered);
  }, [employees, selectedChiNhanh, selectedKyLuong, payrolls]);

  const handleRowClick = (payroll) => {
    setSelectedPayroll(payroll);
  };
  const handleExport = () => {
    alert("Export functionality will be implemented here");
  };
  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel this payroll?")) {
      alert("Payroll cancelled");
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
    try {
      const records = Array.isArray(form?.MaTK)
        ? form.MaTK.map((matk) => ({
            MaTK: matk,
            Thang: form.Thang,
            Nam: form.Nam,
          }))
        : [];

      if (records.length === 0) {
        alert("Chưa chọn nhân viên hoặc dữ liệu không hợp lệ.");
        return;
      }

      const results = await Promise.all(
        records.map((record) => createBangLuong(record))
      );
      const successCount = results.filter((res) => res.success).length;
      const failCount = results.length - successCount;

      alert(`Thành công: ${successCount} nhân viên\nThất bại: ${failCount}`);
      fetchAllBangLuong();
      setShowCreatePayroll(false);
    } catch (error) {
      alert("Có lỗi xảy ra khi tạo bảng lương!");
      console.error(error);
    }
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
          onExport={handleExport}
          setShowCreatePayroll={setShowCreatePayroll}
        />
        <div className="flex-1 overflow-auto p-4">
          <PayrollTable
            // payrolls={filteredPayrolls}
            payrolls={payrollCurrent}
            onRowClick={handleRowClick}
            selectedPayroll={selectedPayroll}
            setSelectedPayroll={setSelectedPayroll}
            setShowDetail={setShowDetail}
          />
          {Array.isArray(payrollCurrent) &&
              <Pagination
                currentPage={currentPage}
                totalPages={totalPage}
                onPageChange={handlePageChange}
              />
            }

          {showCreatePayroll && (
            <div className="mt-4 bg-white rounded-lg shadow">
              <CreatePayrollModal
                setShowCreatePayroll={setShowCreatePayroll}
                employees={employees}
                setSelectedEmployees={setSelectedEmployees}
                onSave={handleCreatePayrollModal}
                selectedEmployees1={selectedEmployees}
                // employee={selectedEmployee}
                // activeTab={activeTab}
                // setActiveTab={setActiveTab}
              />
            </div>
          )}
          {showDetail && (
            <PayrollDetail
              payroll={selectedPayroll}
              onCancel={handleCancel}
            />
          )}
        </div>
      </div>
    </div>
  );
}
