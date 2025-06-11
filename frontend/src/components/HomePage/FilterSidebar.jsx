import React from "react";
export const FilterSidebar = ({
  statusFilter,
  setStatusFilter,
  selectedChiNhanh,
  setSelectedChiNhanh,
  chinhanhs,
}) => {
  return (
    <div className="min-w-64 border-r border-gray-200 p-6 md:mt-10">
      {/* <div className="w-64 border-r border-gray-200 p-6 hidden lg:block mt-10"> */}
      {/* Employee Status Filter */}
      <div className="md:mb-6 border-b p-4 rounded-lg bg-white p-2">
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
      {/* Workplace chinhanh Filter */}
      <div className="md:mb-6 border-b p-4 rounded-lg bg-white p-2">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Chi nhánh làm việc
        </h3>
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
            {(chinhanhs || []).map((chinhanh) => (
              <option key={chinhanh.MaCN} value={chinhanh.TenChiNhanh}>
                {chinhanh.TenChiNhanh}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Position Filter */}
      {/* <div className="mb-6">
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
      </div> */}
    </div>
  );
};
