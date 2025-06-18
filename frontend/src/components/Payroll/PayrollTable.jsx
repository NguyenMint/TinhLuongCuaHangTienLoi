import React, { useState } from "react";
import { formatCurrency } from "../../utils/format";
export function PayrollTable({
  payrolls,
  onRowClick,
  selectedPayroll,
  setSelectedPayroll,
  setShowDetail,
}) {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState({});

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const newSelectedRows = {};
    if (newSelectAll) {
      payrolls.forEach((payroll) => {
        newSelectedRows[`${payroll.KyLuong}-${payroll.MaCN}`] = true;
      });
    }
    setSelectedRows(newSelectedRows);
  };
  const handleSelectRow = (payrollID) => {
    const newSelectedRows = {
      ...selectedRows,
    };
    newSelectedRows[payrollID] = !newSelectedRows[payrollID];
    setSelectedRows(newSelectedRows);
    // Check if all rows are selected
    const allSelected = payrolls.every(
      (payroll) => newSelectedRows[payroll.KyLuong]
    );
    setSelectAll(allSelected);
  };

  const handleDetail = (payrollId) => {
    const payroll = payrolls.find(
      (pay) => `${pay.KyLuong}-${pay.MaCN}` === payrollId
    );
    if (
      selectedPayroll &&
      `${selectedPayroll.KyLuong}-${selectedPayroll.MaCN}` === payrollId
    ) {
      setSelectedPayroll(null);
      setShowDetail(false);
    } else if (payroll) {
      setSelectedPayroll(payroll);
      setShowDetail(true);
    }
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
            <th className="px-4 py-3 text-left">Kỳ lương</th>
            <th className="px-4 py-3 text-left">Tổng lương</th>
            <th className="px-4 py-3 text-left">Người lập bảng</th>
            <th className="px-4 py-3 text-left">Ngày tạo</th>
            <th className="px-4 py-3 text-left">Ngày thanh toán</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payrolls && payrolls.length > 0 ? (
            payrolls.map((payroll) => (
              <tr
                key={`${payroll.KyLuong}-${payroll.MaCN}`}
                className={`border-b hover:bg-gray-50 cursor-pointer ${
                  `${selectedPayroll?.KyLuong}-${selectedPayroll?.MaCN}` ===
                  `${payroll.KyLuong}-${payroll.MaCN}`
                    ? "bg-blue-50"
                    : ""
                }`}
                onClick={() =>
                  handleDetail(`${payroll.KyLuong}-${payroll.MaCN}`)
                }
              >
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={
                      !!selectedRows[`${payroll.KyLuong}-${payroll.MaCN}`]
                    }
                    onChange={() =>
                      handleSelectRow(`${payroll.KyLuong}-${payroll.MaCN}`)
                    }
                  />
                </td>
                <td className="px-4 py-3">{payroll.KyLuong}</td>
                <td className="px-4 py-3 text-right">
                  {formatCurrency(payroll.TongLuongThucNhan)}
                </td>
                <td className="px-4 py-3">Admin</td>
                <td className="px-4 py-3">{payroll.NgayTao}</td>
                <td className="px-4 py-3">
                  {payroll.NgayThanhToan ?? "Chưa thanh toán"}
                </td>
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
