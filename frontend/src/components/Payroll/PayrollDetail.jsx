import React, { useEffect, useState } from "react";
import { FileIcon, TrashIcon } from "lucide-react";
import { formatCurrency } from "../../utils/format";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
export function PayrollDetail({ payroll, onCancel }) {
  const [activeTab, setActiveTab] = useState("information");
  const exportData = [
    { "Mã bảng lương": payroll.MaBangLuong },
    { "Tên nhân viên": payroll.MaTK_tai_khoan.HoTen },
    { "Kỳ lương": payroll.KyLuong },
    { "Ngày tạo": payroll.NgayTao },
    { "Chi nhánh": payroll.MaTK_tai_khoan.MaCN_chi_nhanh.TenChiNhanh },
    { "Lương thực nhận": formatCurrency(payroll.LuongThucNhan) },
    { "Tổng lương": formatCurrency(payroll.TongLuong) },
    { "Thu nhập miễn thuế": formatCurrency(payroll.ThuNhapMienThue) },
    { "Thu nhập chịu thuế": formatCurrency(payroll.ThuNhapChiuThue) },
    { "Thuế phải đóng": formatCurrency(payroll.ThuePhaiDong) },
    { "Tổng phạt": formatCurrency(payroll.TongPhat) },
    { "Tổng phụ cấp": formatCurrency(payroll.TongPhuCap) },
    { "Tổng thưởng": formatCurrency(payroll.TongThuong) },
    {
      "Ngày thanh toán": payroll.NgayThanhToan
        ? payroll.NgayThanhToan
        : "Chưa thanh toán",
    },
  ];
  const handleExport = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Bảng lương");
      worksheet.mergeCells("A1:N1");
      const titleRow = worksheet.getRow(1);
      titleRow.height = 30; 
      titleRow.getCell(1).value = "DANH SÁCH BẢNG LƯƠNG";
      titleRow.getCell(1).font = { bold: true, size: 16, name: "Arial" };
      titleRow.getCell(1).alignment = {
        horizontal: "center",
        vertical: "middle", 
      };
      const headers = exportData.map((item) => Object.keys(item)[0]);
      const headerRow = worksheet.addRow(headers);

      headerRow.font = { bold: true, color: { argb: "000000" } };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF" },
      };
      headerRow.alignment = { horizontal: "center" };

      const rowData = exportData.map((item) => Object.values(item)[0]);
      worksheet.addRow(rowData);

      worksheet.columns = headers.map((header, index) => ({
        width: index === 1 || index === 2 ? 25 : 15,
        style: {
          alignment: {
            horizontal: index === 0 ? "center" : "left",
          },
        },
      }));
      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `Bang_luong_${payroll.MaTK_tai_khoan.HoTen}_${payroll.KyLuong}.xlsx`);
    } catch (error) {
      console.error("Lỗi khi export file Excel:", error);
    }
  };
  return (
    <div className="bg-white rounded shadow mt-4 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`px-6 py-3 font-medium ${
            activeTab === "information"
              ? "border-b-2 border-green-500 text-green-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("information")}
        >
          Thông tin
        </button>
        <button
          className={`px-6 py-3 font-medium ${
            activeTab === "payslip"
              ? "border-b-2 border-green-500 text-green-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("payslip")}
        >
          Phiếu lương
        </button>
        <button
          className={`px-6 py-3 font-medium ${
            activeTab === "history"
              ? "border-b-2 border-green-500 text-green-500"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("history")}
        >
          Lịch sử thanh toán
        </button>
      </div>
      {/* Tab Content */}
      <div className="p-4">
        {activeTab === "information" && (
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex">
                <div className="w-1/3 text-gray-600">Mã bảng lương:</div>
                <div className="w-2/3 font-medium">{payroll.MaBangLuong}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-gray-600">Tên nhân viên:</div>
                <div className="w-2/3 font-medium">
                  {payroll.MaTK_tai_khoan.HoTen}
                </div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-gray-600">Kỳ lương:</div>
                <div className="w-2/3">{payroll.KyLuong}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-gray-600">Ngày tạo:</div>
                <div className="w-2/3">{payroll.NgayTao}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-gray-600">Trạng thái:</div>
                <div className="w-2/3 font-medium">{payroll.status}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-gray-600">Chi nhánh:</div>
                <div className="w-2/3">
                  {payroll.MaTK_tai_khoan.MaCN_chi_nhanh.TenChiNhanh}
                </div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-gray-600">Lương thực nhận:</div>
                <div className="w-2/3">
                  {formatCurrency(payroll.LuongThucNhan)}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex">
                <div className="w-1/3 text-gray-600">Tổng lương:</div>
                <div className="w-1/3 text-right">
                  {formatCurrency(payroll.TongLuong)}
                </div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-gray-600">Thu nhập miễn thuế:</div>
                <div className="w-1/3 text-right ">
                  {formatCurrency(payroll.ThuNhapMienThue)}
                </div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-gray-600">Thu nhập chịu thuế:</div>
                <div className="w-1/3 text-right">
                  {formatCurrency(payroll.ThuNhapChiuThue)}
                </div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-gray-600">Thuế phải đóng:</div>
                <div className="w-1/3 text-right">
                  {formatCurrency(payroll.ThuePhaiDong)}
                </div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-gray-600">Tổng phạt:</div>
                <div className="w-1/3 text-right">
                  {formatCurrency(payroll.TongPhat)}
                </div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-gray-600">Tổng phụ cấp:</div>
                <div className="w-1/3 text-right">
                  {formatCurrency(payroll.TongPhuCap)}
                </div>
              </div>{" "}
              <div className="flex">
                <div className="w-1/3 text-gray-600">Tổng thưởng:</div>
                <div className="w-1/3 text-right">
                  {formatCurrency(payroll.TongThuong)}
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "payslip" && (
          <div className="p-4 text-center text-gray-500">Phiếu lương</div>
        )}
        {activeTab === "history" && (
          <div className="p-4 text-center text-gray-500">
            Lịch sử thanh toán
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="flex justify-between p-4 border-t">
        <div className="text-gray-500">
          {/* Dữ liệu được tải lại vào: {payroll.lastUpdated} */}
        </div>
        <div className="flex space-x-2">
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded flex items-center"
            onClick={handleExport}
          >
            <FileIcon size={18} className="mr-1" />
            <span>Xuất file</span>
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
            onClick={onCancel}
          >
            <TrashIcon size={18} className="mr-1" />
            <span>Hủy bỏ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
