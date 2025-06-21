import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

/**
 * Hàm xuất danh sách bảng lương ra file Excel
 * @param {Object} phieuLuongs - Dữ liệu bảng lương từ API
 * @param {string} selectedKyLuong - Kỳ lương được chọn
 */
export const exportPayrollToExcel = async (phieuLuongs, selectedKyLuong) => {
  try {
    // Kiểm tra dữ liệu đầu vào
    if (
      !phieuLuongs ||
      !phieuLuongs.employees ||
      phieuLuongs.employees.length === 0
    ) {
      throw new Error("Không có dữ liệu bảng lương để xuất");
    }

    // Tạo workbook và worksheet mới
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Bảng lương");

    // Thiết lập tiêu đề chính
    worksheet.mergeCells("A1:I1");
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

    // Thêm thông tin kỳ lương
    worksheet.mergeCells("A2:I2");
    const periodRow = worksheet.getRow(2);
    periodRow.height = 25;
    periodRow.getCell(1).value = `Kỳ lương: ${
      selectedKyLuong || phieuLuongs.KyLuong
    }`;
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

    // Định nghĩa headers cho bảng
    const headers = [
      "STT",
      "Mã nhân viên",
      "Họ tên",
      "Tổng lương",
      "Tổng phụ cấp",
      "Tổng thưởng",
      "Tổng phạt",
      "Thuế phải đóng",
      "Lương thực nhận",
    ];

    // Thêm headers vào row thứ 4 (sau tiêu đề)
    const headerRow = worksheet.addRow(headers);
    headerRow.font = {
      bold: true,
      color: { argb: "FFFFFF" },
      size: 12,
    };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "4472C4" }, // Màu xanh dương
    };
    headerRow.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    // Thêm dữ liệu từ phieuLuongs
    phieuLuongs.employees.forEach((employee, index) => {
      const row = worksheet.addRow([
        index + 1, // STT
        employee.MaNhanVien,
        employee.HoTen,
        parseFloat(employee.TongLuong) || 0,
        parseFloat(employee.TongPhuCap) || 0,
        parseFloat(employee.TongThuong) || 0,
        parseFloat(employee.TongPhat) || 0,
        parseFloat(employee.ThuePhaiDong) || 0,
        parseFloat(employee.LuongThucNhan) || 0,
      ]);

      // Định dạng cho các cột số tiền
      row.getCell(4).numFmt = "#,##0"; // Tổng lương
      row.getCell(5).numFmt = "#,##0"; // Tổng phụ cấp
      row.getCell(6).numFmt = "#,##0"; // Tổng thưởng
      row.getCell(7).numFmt = "#,##0"; // Tổng phạt
      row.getCell(8).numFmt = "#,##0"; // Thuế phải đóng
      row.getCell(9).numFmt = "#,##0"; // Lương thực nhận

      // Căn giữa cho cột STT và Mã nhân viên
      row.getCell(1).alignment = { horizontal: "center" };
      row.getCell(2).alignment = { horizontal: "center" };

      // Căn phải cho các cột số tiền
      row.getCell(4).alignment = { horizontal: "right" };
      row.getCell(5).alignment = { horizontal: "right" };
      row.getCell(6).alignment = { horizontal: "right" };
      row.getCell(7).alignment = { horizontal: "right" };
      row.getCell(8).alignment = { horizontal: "right" };
      row.getCell(9).alignment = { horizontal: "right" };
    });

    // Thêm dòng tổng cộng
    const totalRow = worksheet.addRow([
      "",
      "TỔNG CỘNG",
      "",
      phieuLuongs.employees.reduce(
        (sum, emp) => sum + (parseFloat(emp.TongLuong) || 0),
        0
      ),
      phieuLuongs.employees.reduce(
        (sum, emp) => sum + (parseFloat(emp.TongPhuCap) || 0),
        0
      ),
      phieuLuongs.employees.reduce(
        (sum, emp) => sum + (parseFloat(emp.TongThuong) || 0),
        0
      ),
      phieuLuongs.employees.reduce(
        (sum, emp) => sum + (parseFloat(emp.TongPhat) || 0),
        0
      ),
      phieuLuongs.employees.reduce(
        (sum, emp) => sum + (parseFloat(emp.ThuePhaiDong) || 0),
        0
      ),
      phieuLuongs.employees.reduce(
        (sum, emp) => sum + (parseFloat(emp.LuongThucNhan) || 0),
        0
      ),
    ]);

    // Định dạng dòng tổng cộng
    totalRow.font = { bold: true, color: { argb: "FFFFFF" } };
    totalRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "70AD47" }, // Màu xanh lá
    };
    totalRow.alignment = { horizontal: "center", vertical: "middle" };

    // Định dạng số cho dòng tổng cộng
    totalRow.getCell(4).numFmt = "#,##0";
    totalRow.getCell(5).numFmt = "#,##0";
    totalRow.getCell(6).numFmt = "#,##0";
    totalRow.getCell(7).numFmt = "#,##0";
    totalRow.getCell(8).numFmt = "#,##0";
    totalRow.getCell(9).numFmt = "#,##0";

    totalRow.getCell(4).alignment = { horizontal: "right" };
    totalRow.getCell(5).alignment = { horizontal: "right" };
    totalRow.getCell(6).alignment = { horizontal: "right" };
    totalRow.getCell(7).alignment = { horizontal: "right" };
    totalRow.getCell(8).alignment = { horizontal: "right" };
    totalRow.getCell(9).alignment = { horizontal: "right" };

    // Thiết lập độ rộng cột
    worksheet.columns = [
      { width: 8 }, // STT
      { width: 15 }, // Mã nhân viên
      { width: 30 }, // Họ tên
      { width: 15 }, // Tổng lương
      { width: 15 }, // Tổng phụ cấp
      { width: 15 }, // Tổng thưởng
      { width: 15 }, // Tổng phạt
      { width: 15 }, // Thuế phải đóng
      { width: 15 }, // Lương thực nhận
    ];

    // Thêm border cho tất cả các ô
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

    // Thêm thông tin footer
    const lastRow = worksheet.rowCount;
    worksheet.mergeCells(`A${lastRow + 2}:I${lastRow + 2}`);
    const footerRow = worksheet.getRow(lastRow + 2);
    footerRow.getCell(
      1
    ).value = `Xuất báo cáo ngày: ${new Date().toLocaleDateString("vi-VN")}`;
    footerRow.getCell(1).font = { italic: true, size: 10 };
    footerRow.getCell(1).alignment = { horizontal: "center" };

    // Tạo buffer và download file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Tạo tên file
    const kyLuong = selectedKyLuong || phieuLuongs.KyLuong;
    const fileName = kyLuong
      ? `Bang_luong_${kyLuong.replace(/\//g, "-")}.xlsx`
      : `Bang_luong_${new Date().toISOString().split("T")[0]}.xlsx`;

    saveAs(blob, fileName);
    return { success: true, fileName };
  } catch (error) {
    console.error("Lỗi khi export file Excel:", error);
    throw error;
  }
};
