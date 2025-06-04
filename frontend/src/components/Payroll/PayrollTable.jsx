import React, { useState } from "react";
export function PayrollTable({
  payrolls,
  onRowClick,
  selectedPayroll,
  employees,
}) {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState({});

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const newSelectedRows = {};
    if (newSelectAll) {
      employees.forEach((employee) => {
        newSelectedRows[employee.MaTK] = true;
      });
    }
    setSelectedRows(newSelectedRows);
  };

  return (
    <div className="bg-white rounded shadow overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="w-10 px-4 py-3 text-left">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </th>
            <th className="px-4 py-3 text-left">Tên</th>
            <th className="px-4 py-3 text-left">Kỳ hạn trả</th>
            <th className="px-4 py-3 text-left">Kỳ làm việc</th>
            <th className="px-4 py-3 text-left">Tổng lương</th>
            <th className="px-4 py-3 text-left">Còn cần trả</th>
            <th className="px-4 py-3 text-left">Trạng thái</th>
            <th className="px-4 py-3 text-left">Người lập bảng</th>
            <th className="px-4 py-3 text-left">Ngày tạo</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payrolls && payrolls.length > 0 ? (
            payrolls.map((payroll) => (
              <tr
                key={payroll.id}
                className={`border-b hover:bg-gray-50 cursor-pointer ${
                  selectedPayroll?.id === payroll.id ? "bg-blue-50" : ""
                }`}
                onClick={() => onRowClick(payroll)}
              >
                <td className="px-4 py-3">
                  <input type="checkbox" onClick={(e) => e.stopPropagation()} />
                </td>
                <td className="px-4 py-3">{payroll.name}</td>
                <td className="px-4 py-3">{payroll.paymentCycle}</td>
                <td className="px-4 py-3">{payroll.workPeriod}</td>
                <td className="px-4 py-3">{payroll.totalSalary}</td>
                <td className="px-4 py-3">{payroll.amountDue}</td>
                <td className="px-4 py-3">{payroll.status}</td>
                <td className="px-4 py-3">{payroll.creator}</td>
                <td className="px-4 py-3">{payroll.creationDate}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-8 text-gray-500">
                Không có bảng lương nào để hiển thị.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
