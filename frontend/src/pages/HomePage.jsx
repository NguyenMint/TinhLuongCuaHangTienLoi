import React, { useState } from "react";
import { FilterSidebar } from "../components/HomePage/LeftSidebar.jsx";
import { EmployeeTable } from "../components/HomePage/EmployeeTable.jsx";
import { EmployeeDetail } from "../components/HomePage/EmployeeDetail.jsx";
import Search from "../components/search.jsx";
import { fetchAllNhanVien, searchEmployee } from "../api.js";
import { useEffect } from "react";

export function HomePage() {
  // State for filters
  const [statusFilter, setStatusFilter] = useState("working");
  const [workplaceBranch, setWorkplaceBranch] = useState("");
  const [payrollBranch, setPayrollBranch] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  // State for selected employee and active tab
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const getAllNhanVien = async () => {
    try {
      const data = await fetchAllNhanVien();
      setEmployees(data);
    } catch (error) {
      console.error("Lỗi khi lấy Nhân viên:", error);
    }
  };

  useEffect(() => {
    getAllNhanVien();
  }, []);

  // Event handlers
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
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          workplaceBranch={workplaceBranch}
          setWorkplaceBranch={setWorkplaceBranch}
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
              employees={employees}
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
