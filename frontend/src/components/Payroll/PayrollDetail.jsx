import React, { useEffect, useState } from "react";
import { FileIcon, TrashIcon, X } from "lucide-react";
import { formatCurrency } from "../../utils/format";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { PhieuLuongsTab } from "./PhieuLuongTab";
export function PayrollDetail({
  payroll,
  onDelete,
  closeDetailModal,
  phieuLuongs,
}) {
  const [activeTab, setActiveTab] = useState("information");
  const phieuLuong = phieuLuongs.employees;
  const handleExport = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Bảng lương");
      worksheet.mergeCells("A1:K1");
      const titleRow = worksheet.getRow(1);
      titleRow.height = 30;
      titleRow.getCell(1).value = "DANH SÁCH BẢNG LƯƠNG NHÂN VIÊN";
      titleRow.getCell(1).font = {
        bold: true,
        size: 16,
        name: "Arial",
        color: { argb: "000000" },
      };
      titleRow.getCell(1).alignment = {
        horizontal: "center",
        vertical: "middle",
      };
      worksheet.mergeCells("A2:I2");
      const periodRow = worksheet.getRow(2);
      periodRow.height = 25;
      periodRow.getCell(1).value = `Kỳ lương: ${payroll.KyLuong}`;
      periodRow.getCell(1).font = {
        bold: true,
        size: 14,
        name: "Arial",
        color: { argb: "000000" },
      };
      periodRow.getCell(1).alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      const headers = [
        "STT",
        "Mã nhân viên",
        "Họ tên",
        "Số giờ làm việc",
        "Lương tháng",
        "Tổng phụ cấp",
        "Tổng thưởng",
        "Tổng phạt",
        "Tổng lương",
        "Thuế phải đóng",
        "Lương thực nhận",
      ];

      const headerRow = worksheet.addRow(headers);
      headerRow.eachCell({ includeEmpty: true }, (cell) => {
        cell.font = {
          bold: true,
          color: { argb: "FFFFFF" },
          size: 12,
        };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "4472C4" },
        };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
        };
      });

      if (
        phieuLuongs &&
        phieuLuongs.employees &&
        phieuLuongs.employees.length > 0
      ) {
        phieuLuongs.employees.forEach((employee, index) => {
          const row = worksheet.addRow([
            index + 1,
            employee.MaNhanVien,
            employee.HoTen,
            employee.TongGioLamViec,
            parseFloat(employee.LuongThang) || 0,
            parseFloat(employee.TongPhuCap) || 0,
            parseFloat(employee.TongThuong) || 0,
            parseFloat(employee.TongPhat) || 0,
            parseFloat(employee.TongLuong) || 0,
            parseFloat(employee.ThuePhaiDong) || 0,
            parseFloat(employee.LuongThucNhan) || 0,
          ]);

          row.getCell(5).numFmt = "#,##0";
          row.getCell(6).numFmt = "#,##0";
          row.getCell(7).numFmt = "#,##0";
          row.getCell(8).numFmt = "#,##0";
          row.getCell(9).numFmt = "#,##0";
          row.getCell(10).numFmt = "#,##0";
          row.getCell(11).numFmt = "#,##0";

          row.getCell(1).alignment = { horizontal: "center" };
          row.getCell(2).alignment = { horizontal: "center" };
          row.getCell(4).alignment = { horizontal: "right" };
          row.getCell(5).alignment = { horizontal: "right" };
          row.getCell(6).alignment = { horizontal: "right" };
          row.getCell(7).alignment = { horizontal: "right" };
          row.getCell(8).alignment = { horizontal: "right" };
          row.getCell(9).alignment = { horizontal: "right" };
          row.getCell(10).alignment = { horizontal: "right" };
          row.getCell(11).alignment = { horizontal: "right" };
        });

        const totalRow = worksheet.addRow([]);
        worksheet.mergeCells(`A${totalRow.number}:J${totalRow.number}`);
        const labelCell = totalRow.getCell(1);
        labelCell.value = "TỔNG CỘNG";
        labelCell.alignment = { horizontal: "right", vertical: "middle" };

        const valueCell = totalRow.getCell(11);
        valueCell.value = parseFloat(payroll.TongLuongThucNhan) || 0;

        totalRow.eachCell({ includeEmpty: true }, (cell) => {
          cell.font = { bold: true, color: { argb: "FFFFFF" } };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "4472C4" },
          };
        });
        valueCell.numFmt = "#,##0.##";
        valueCell.alignment = { horizontal: "right", vertical: "middle" };
      }

      worksheet.columns = [
        { width: 8 },
        { width: 15 },
        { width: 30 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
      ];

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
      const fileName = `Bang_luong_${payroll.KyLuong}.xlsx`;
      saveAs(blob, fileName);
      alert("Xuất file Excel thành công!");
    } catch (error) {
      console.error("Lỗi khi export file Excel:", error);
      alert("Có lỗi xảy ra khi xuất file Excel!");
    }
  };

  return (
    <div className="bg-white rounded shadow mt-4 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b items-center">
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
        <div className="flex-1" />
        <button
          onClick={closeDetailModal}
          className="text-gray-500 hover:text-gray-700 p-1"
        >
          <X className="h-6 w-6 mr-6" />
        </button>
      </div>
      {/* Tab Content */}
      <div className="p-4">
        {activeTab === "information" && (
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex">
                <div className="w-1/3 text-gray-600">Kỳ lương:</div>
                <div className="w-2/3">{payroll.KyLuong}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-gray-600">Ngày tạo:</div>
                <div className="w-2/3">{payroll.NgayTao}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-gray-600">Tổng số nhân viên: </div>
                <div className="w-2/3">{payroll.SoLuong}</div>
              </div>
              {payroll.MaCN && (
                <div className="flex">
                  <div className="w-1/3 text-gray-600">Chi nhánh:</div>
                  <div className="w-2/3">{payroll.TenChiNhanh}</div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex">
                <div className="w-1/3 text-gray-600">Tổng lương:</div>
                <div className="w-1/3 text-right">
                  {formatCurrency(payroll.TongLuongThucNhan)}
                </div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-gray-600">Đã trả nhân viên:</div>
                <div className="w-1/3 text-right">
                  {formatCurrency(payroll.LuongDaTra)}
                </div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-gray-600">Còn cần trả:</div>
                <div className="w-1/3 text-right ">
                  {formatCurrency(payroll.LuongChuaTra)}
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "payslip" && (
          <PhieuLuongsTab phieuLuong={phieuLuong}></PhieuLuongsTab>
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
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
            onClick={handleExport}
          >
            <FileIcon size={18} className="mr-1" />
            <span>Xuất file</span>
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
            onClick={() => onDelete(payroll.KyLuong)}
          >
            <TrashIcon size={18} className="mr-1" />
            <span>Hủy bỏ bảng lương</span>
          </button>
        </div>
      </div>
    </div>
  );
}
