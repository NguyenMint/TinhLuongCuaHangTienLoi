import React, { useState } from "react";
import { FilterSidebar } from "../components/HomePage/FilterSidebar.jsx";
import { EmployeeTable } from "../components/HomePage/EmployeeTable.jsx";
import { EmployeeDetail } from "../components/HomePage/EmployeeDetail.jsx";
import Search from "../components/search.jsx";
import { fetchAllNhanVien, searchEmployee } from "../api/api.js";
import { useEffect } from "react";
import { getChiNhanh } from "../api/apiChiNhanh.js";

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
    let filtered = [...employees];

    // Lọc theo chi nhánh
    if (selectedChiNhanh) {
      filtered = filtered.filter(
        (emp) => emp.MaCN === Number(selectedChiNhanh.MaCN)
      );
    }
    
    // Lọc theo trạng thái
    if (statusFilter === "working") {
      filtered = filtered.filter((emp) => emp.TrangThai === "Đang làm");
    } else if (statusFilter === "resigned") {
      filtered = filtered.filter((emp) => emp.TrangThai === "Đã nghỉ");
    }
    setFilteredEmployees(filtered);
  }, [employees, selectedChiNhanh, statusFilter]);

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
          </div>
          <div className="mt-6">
            <EmployeeTable
              employees={filteredEmployees}
              selectedEmployee={selectedEmployee}
              setSelectedEmployee={setSelectedEmployee}
              setShowDetail={setShowDetail}
            />
          </div>
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
      </div>
    </div>
  );
}
