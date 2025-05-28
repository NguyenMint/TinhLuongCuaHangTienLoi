import React, { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { FilterSidebar } from "../components/Home/LeftSidebar.jsx";
import { EmployeeTable } from "../components/Home/EmployeeTable.jsx";
import { EmployeeDetail } from "../components/Home/EmployeeDetail.jsx";
import { employeeData } from "../utils/mockData.ts";
import Search from "../components/search.jsx";
import { fetchAllNhanVien } from "../api.js";
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
  const [activeTab, setActiveTab] = useState("info");
  // Mock data
  const [employees, setEmployees] = useState([]);

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
    // Implementation would go here
  };
  const handleImportFile = () => {
    console.log("Import file clicked");
    // Implementation would go here
  };
  const handleExportFile = () => {
    console.log("Export file clicked");
    // Implementation would go here
  };
  const handleSearch = (query) => {
    console.log("Searching for:", query);
    // Implementation would go here
  };
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1">
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
        <div className="flex-1 p-6">
          {/* <Header
            onSearch={handleSearch}
            onAddEmployee={handleAddEmployee}
            onImportFile={handleImportFile}
            onExportFile={handleExportFile}
          /> */}
          <Search placeholder="Tìm kiếm nhân viên..." />
          <div className="mt-6">
            <EmployeeTable
              employees={employees}
              selectedEmployee={selectedEmployee}
              setSelectedEmployee={setSelectedEmployee}
            />
          </div>
          {selectedEmployee && (
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
