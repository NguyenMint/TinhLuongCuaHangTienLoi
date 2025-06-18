import React, { useState } from "react";
import { ChevronDownIcon, XIcon } from "lucide-react";
export function FilterSidebar({
  setIsTotal,
  chinhanhs,
  statusFilters,
  onStatusFilterChange,
  kyLuongs,
  setSelectedKyLuong,
  setSelectedChiNhanh,
}) {
  const [branchFilter, setBranchFilter] = useState("Chi nhánh trung tâm");
  const [payrollCycle, setPayrollCycle] = useState("Chọn kỳ hạn trả lương");
  return (
    <div className="min-w-64 border-r border-gray-200 p-3 md:mt-1">
      <div className="p-4 border-gray-200">
        <h1 className="text-xl font-bold">Bảng lương</h1>
      </div>
      {/* Branch Filter */}
      <div className="md:mb-6 border-b p-4 rounded-lg bg-white p-2">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Chi nhánh</h3>
        <div className="relative">
          <select
            className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => {
              const selected = chinhanhs?.find(
                (chinhanh) => chinhanh.TenChiNhanh === e.target.value
              );
              setSelectedChiNhanh(selected ?? "Tổng hợp");
            }}
          >
            <option value="">Tổng hợp</option>
            {chinhanhs.map?.((chinhanh) => (
              <option key={chinhanh.MaCN} value={chinhanh.TenChiNhanh}>
                {chinhanh.TenChiNhanh}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Payment Cycle Filter */}
      <div className="md:mb-6 border-b p-4 rounded-lg bg-white p-2">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Kỳ hạn trả lương
        </h3>
        <div className="relative">
          <select
            className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            onChange={(e) => {
              setSelectedKyLuong(e.target.value ?? "");
            }}
          >
            <option value="">Chọn kỳ hạn trả lương</option>
            {kyLuongs.map?.((kyLuong, index) => (
              <option key={index} value={kyLuong.KyLuong}>
                {kyLuong.KyLuong}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Filter */}
      {/* <div className="mb-6 border-b pb-4 rounded-lg bg-white p-5">
        <h2 className="font-medium mb-2">Trạng thái</h2>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="creating"
              className="mr-2"
              checked={statusFilters.creating}
              onChange={(e) =>
                onStatusFilterChange("creating", e.target.checked)
              }
            />
            <label htmlFor="creating">Đang tạo</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="draft"
              className="mr-2"
              checked={statusFilters.draft}
              onChange={(e) => onStatusFilterChange("draft", e.target.checked)}
            />
            <label htmlFor="draft">Tạm tính</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="finalized"
              className="mr-2"
              checked={statusFilters.finalized}
              onChange={(e) =>
                onStatusFilterChange("finalized", e.target.checked)
              }
            />
            <label htmlFor="finalized">Đã chốt lương</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="cancelled"
              className="mr-2"
              checked={statusFilters.cancelled}
              onChange={(e) =>
                onStatusFilterChange("cancelled", e.target.checked)
              }
            />
            <label htmlFor="cancelled">Đã hủy</label>
          </div>
        </div>
      </div> */}
      {/* Record Count */}
      {/* <div className="p-4 flex items-center justify-between border-b rounded-lg bg-white p-2">
        <span className="text-sm">Số bản ghi:</span>
        <div className="flex items-center border border-gray-200 rounded">
          <span className="px-2">15</span>
          <ChevronDownIcon size={16} className="text-gray-400" />
        </div>
      </div> */}
    </div>
  );
}
