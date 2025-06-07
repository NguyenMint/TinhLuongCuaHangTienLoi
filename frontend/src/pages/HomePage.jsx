import React, { useState } from "react";
import { FilterSidebar } from "../components/HomePage/FilterSidebar.jsx";
import { EmployeeTable } from "../components/HomePage/EmployeeTable.jsx";
import { EmployeeDetail } from "../components/HomePage/EmployeeDetail.jsx";
import Search from "../components/search.jsx";
import { fetchAllNhanVien, searchEmployee } from "../api/apiTaiKhoan.js";
import { useEffect } from "react";
import { getChiNhanh } from "../api/apiChiNhanh.js";
import { AddEmployeeModal } from "../components/Employee/AddNewEmployeeModal.jsx";
import { Pagination } from "../components/Pagination.jsx";
export function HomePage() {
  // State for filters
  const [statusFilter, setStatusFilter] = useState("working");
  const [selectedChiNhanh, setSelectedChiNhanh] = useState("");
  const [payrollBranch, setPayrollBranch] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [chinhanhs, setChiNhanhs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  // 3 useState đóng mở thêm sửa nhân viên
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  // Tính toán phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const nhanVienInPage = 5;
  const indexLast = currentPage * nhanVienInPage;
  const indexFirst = indexLast - nhanVienInPage;
  const employeeCurrent = filteredEmployees.slice(indexFirst, indexLast);
  const totalPage = Math.ceil(filteredEmployees.length / nhanVienInPage);
  const handlePageChange = (pagenumber) => {
    setCurrentPage(pagenumber);
  };
  const getAllNhanVien = async () => {
    try {
      const data = await fetchAllNhanVien();
      setEmployees(data);
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
    getAllNhanVien();
    fetchChiNhanh();
  }, []);

  useEffect(() => {
    const filtered = selectedChiNhanh
      ? employees.filter((emp) => emp.MaCN === Number(selectedChiNhanh.MaCN))
      : employees;
    setFilteredEmployees(filtered);
  }, [employees, selectedChiNhanh]);
  useEffect(() => {
  setCurrentPage(1);
}, [filteredEmployees]);
  const handleAddEmployee = () => {
    console.log("Add employee clicked");
  };
  const handleImportFile = () => {
    console.log("Import file clicked");
  };
  const handleExportFile = () => {
    console.log("Export file clicked");
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
  return (
    <div className="flex">
      <div className="md:flex flex-1">
        <FilterSidebar
          chinhanhs={chinhanhs}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          selectedChiNhanh={selectedChiNhanh}
          setSelectedChiNhanh={setSelectedChiNhanh}
          payrollBranch={payrollBranch}
          setPayrollBranch={setPayrollBranch}
          department={department}
          setDepartment={setDepartment}
          position={position}
          setPosition={setPosition}
        />
        <div className="flex-1 px-6 md:p-6">
          <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
            <Search
              placeholder="Tìm kiếm nhân viên..."
              onSearch={handleSearch}
              setQuery={setSearchQuery}
            />
            {/* <CreateInvoice /> */}
            <div className="">
              <button
                onClick={() => setShowModalAdd(true)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Thêm nhân viên
              </button>
              <button
                onClick={handleImportFile}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
              >
                Nhập file
              </button>
              <button
                onClick={handleExportFile}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-yellow-600 ml-2"
              >
                Xuất file
              </button>
            </div>
          </div>
          <div className="mt-6">
            <EmployeeTable
              employees={employeeCurrent}
              selectedEmployee={selectedEmployee}
              setSelectedEmployee={setSelectedEmployee}
              setShowDetail={setShowDetail}
            />
          </div>
          <Pagination 
          currentPage={currentPage}
          totalPages={totalPage}
          onPageChange={handlePageChange}
          ></Pagination>
          {showDetail && (
            <div className="mt-4 bg-white rounded-lg shadow">
              <EmployeeDetail
                employee={selectedEmployee}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
          )}
        </div>
        {showModalAdd && (
          <AddEmployeeModal
            setShowModalAdd={setShowModalAdd}
            getAllEmployees={getAllNhanVien}
            chiNhanhs={chinhanhs}
          />
        )}
      </div>
    </div>
  );
}
