import React from "react";
import { ChevronDownIcon, PlusIcon } from "lucide-react";
export const FilterSidebar = ({
  statusFilter,
  setStatusFilter,
  workplaceBranch,
  setWorkplaceBranch,
  payrollBranch,
  setPayrollBranch,
  department,
  setDepartment,
  position,
  setPosition,
}) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 hidden lg:block ml-16 md:ml-64">
      {/* Employee Status Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Trạng thái nhân viên
        </h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value="working"
              checked={statusFilter === "working"}
              onChange={() => setStatusFilter("working")}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-sm text-gray-700">Đang làm việc</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="status"
              value="resigned"
              checked={statusFilter === "resigned"}
              onChange={() => setStatusFilter("resigned")}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-sm text-gray-700">Đã nghỉ</span>
          </label>
        </div>
      </div>
      {/* Workplace Branch Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Chi nhánh làm việc
        </h3>
        <div className="relative">
          <select
            value={workplaceBranch}
            onChange={(e) => setWorkplaceBranch(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Chọn chi nhánh...</option>
            <option value="branch1">Chi nhánh trung tâm</option>
            <option value="branch2">Chi nhánh 2</option>
          </select>
        </div>
      </div>
      {/* Payroll Branch Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Chi nhánh trả lương
        </h3>
        <div className="relative">
          <select
            value={payrollBranch}
            onChange={(e) => setPayrollBranch(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Chọn chi nhánh...</option>
            <option value="branch1">Chi nhánh trung tâm</option>
            <option value="branch2">Chi nhánh 2</option>
          </select>
        </div>
      </div>
      {/* Department Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-700">Phòng ban</h3>
          <button className="text-blue-600 hover:text-blue-800">
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="relative">
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Chọn phòng ban...</option>
            <option value="hr">Nhân sự</option>
            <option value="it">IT</option>
            <option value="finance">Tài chính</option>
          </select>
        </div>
      </div>
      {/* Position Filter */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-700">Chức danh</h3>
          <button className="text-blue-600 hover:text-blue-800">
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="relative">
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Chọn chức danh...</option>
            <option value="manager">Quản lý</option>
            <option value="staff">Nhân viên</option>
            <option value="intern">Thực tập sinh</option>
          </select>
        </div>
      </div>
    </div>
  );
};
