import React, { useEffect, useState } from "react";
import { formatCurrency } from "../../utils/format";
import { X, FileIcon, ChevronDown, ChevronUp } from "lucide-react";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { toast } from "react-toastify";
import { getAllPhuCapConHieuLuc } from "../../api/apiPhuCap";
export const PhieuLuongsTab = ({ phieuLuong }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [detailData, setDetailData] = useState([]);
  const [expandedDetails, setExpandedDetails] = useState({});
  const [phuCaps, setPhuCaps] = useState([]);
  // Hàm mở modal và lấy dữ liệu chi tiết
  const openDetailModal = (employee) => {
    fetchPhuCaps(employee.MaNhanVien);
    setShowModal(true);
    setSelectedEmployee(employee);
  };
  const fetchPhuCaps = async (MaNV) => {
    try{
      const response = await getAllPhuCapConHieuLuc(MaNV);
      console.log("Phu Caps:",response);
      setPhuCaps(response);
    } catch (error) {
      console.error("Error fetching Phu Caps:", error);
      toast.error("Đã xảy ra lỗi khi lấy phụ cấp.");
    }
  };
  // Hàm đóng modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
    setDetailData([]);
    setExpandedDetails({});
  };
  const toggleDetailExpansion = (detailIndex) => {
    setExpandedDetails((prev) => ({
      ...prev,
      [detailIndex]: !prev[detailIndex],
    }));
  };
  const handleExport = async () => {
    try {
      if (
        !selectedEmployee ||
        !selectedEmployee.details ||
        selectedEmployee.details.length === 0
      ) {
        toast.warning("Không có dữ liệu để xuất!");
        return;
      }
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("ChiTietLuongCa");
      worksheet.mergeCells("A1:K1");
      const titleRow = worksheet.getRow(1);
      titleRow.height = 30;
      titleRow.getCell(
        1
      ).value = `Chi tiết lương của nhân viên ${selectedEmployee.MaNhanVien} - ${selectedEmployee.HoTen}`;
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

      const headers = [
        "STT",
        "Ngày",
        "Giờ làm việc",
        "Lương/giờ",
        "Hệ số lương",
        "Loại ca",
        "Loại ngày",
        "Tiền lương ca",
        "Thưởng phụ cấp",
        "Phạt",
        "Tổng tiền",
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

      let stt = 1;
      selectedEmployee.details.forEach((detail) => {
        const row = worksheet.addRow([
          stt++,
          detail.Ngay,
          detail.GioLamViec,
          parseFloat(detail.LuongMotGio),
          detail.HeSoLuong,
          detail.isCaDem ? "Ca đêm" : "Ca thường",
          detail.isNgayLe
            ? "Ngày lễ"
            : detail.isCuoiTuan
            ? "Cuối tuần"
            : "Ngày thường",
          parseFloat(detail.TienLuongCa),
          parseFloat(detail.TienPhuCap),
          parseFloat(detail.TienPhat),
          parseFloat(detail.tongtien),
        ]);
        row.getCell(4).numFmt = "#,##0";
        row.getCell(8).numFmt = "#,##0";
        row.getCell(9).numFmt = "#,##0";
        row.getCell(10).numFmt = "#,##0";
        row.getCell(11).numFmt = "#,##0";
      });

      worksheet.columns = [
        { width: 8 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
      ];
      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          if (rowNumber > 2) {
            cell.alignment = { horizontal: "center", vertical: "middle" };
          }
        });
      });
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const fileName = `ChiTietLuongCa_${selectedEmployee.MaNhanVien}.xlsx`;
      saveAs(blob, fileName);
      toast.success("Xuất file Excel chi tiết thành công!");
    } catch (error) {
      console.error("Lỗi khi export file Excel chi tiết:", error);
      toast.error("Có lỗi xảy ra khi xuất file Excel chi tiết!");
    }
  };
  return (
    <div className="text-center">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Mã NV</th>
            <th className="border border-gray-300 p-2">Tên NV</th>
            <th className="border border-gray-300 p-2">Số giờ làm việc</th>
            <th className="border border-gray-300 p-2">Lương tháng</th>
            <th className="border border-gray-300 p-2">Phụ Cấp</th>
            <th className="border border-gray-300 p-2">Thưởng</th>
            <th className="border border-gray-300 p-2">Phạt</th>
            <th className="border border-gray-300 p-2">Tổng Lương</th>
            <th className="border border-gray-300 p-2">Thu Nhập Trước Thuế</th>
            <th className="border border-gray-300 p-2">Mức Giảm Trừ Gia Cảnh</th>
            <th className="border border-gray-300 p-2">Thu Nhập Chịu Thuế</th>
            <th className="border border-gray-300 p-2">Thuế phải đóng</th>
            <th className="border border-gray-300 p-2">Lương Thực Nhận</th>
          </tr>
        </thead>
        <tbody>
          {phieuLuong.map((employee) => (
            <tr
              className="cursor-pointer hover:text-gray-500"
              key={employee.MaBangLuong}
              onClick={() => openDetailModal(employee)}
            >
              <td className="border border-gray-300 p-2 text-center">
                {employee.MaNhanVien}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                {employee.HoTen}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                {employee.TongGioLamViec} giờ
              </td>
              <td className="border border-gray-300 p-2 text-center">
                {formatCurrency(employee.LuongThang)}
              </td>
              <td className="border border-gray-300 p-2 text-right">
                {formatCurrency(employee.TongPhuCap)}
              </td>
              <td className="border border-gray-300 p-2 text-right">
                {formatCurrency(employee.TongThuong)}
              </td>
              <td className="border border-gray-300 p-2 text-right">
                {formatCurrency(employee.TongPhat)}
              </td>
              <td className="border border-gray-300 p-2 text-right">
                {formatCurrency(employee.TongLuong)}
              </td>
              <td className="border border-gray-300 p-2 text-right">
                {formatCurrency(employee.ThuNhapTruocThue)}
              </td>
              <td className="border border-gray-300 p-2 text-right">
                {formatCurrency(employee.MucGiamTruGiaCanh)}
              </td>
              <td className="border border-gray-300 p-2 text-right">
                {formatCurrency(employee.ThuNhapChiuThue)}
              </td>
              <td className="border border-gray-300 p-2 text-right">
                {formatCurrency(employee.ThuePhaiDong)}
              </td>
              <td className="border border-gray-300 p-2 text-right">
                {formatCurrency(employee.LuongThucNhan)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-3/4 max-h-[80vh] overflow-y-auto">
            <div className="flex border-b items-center">
              <div className="flex-1 flex justify-center">
                <h2 className="text-xl font-bold mb-4 text-center">
                  Chi tiết phiếu lương - {selectedEmployee.HoTen} (
                  {selectedEmployee.MaNhanVien})
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X className="h-6 w-6 mr-6" />
              </button>
            </div>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">Ngày</th>
                  <th className="border border-gray-300 p-2">Giờ làm việc</th>
                  <th className="border border-gray-300 p-2">Lương/giờ</th>
                  <th className="border border-gray-300 p-2">Hệ số lương</th>
                  <th className="border border-gray-300 p-2">Loại ca</th>
                  <th className="border border-gray-300 p-2">Loại ngày</th>
                  <th className="border border-gray-300 p-2">Tiền lương ca</th>
                  <th className="border border-gray-300 p-2">Thưởng phụ cấp</th>
                  <th className="border border-gray-300 p-2">Phạt</th>
                  <th className="border border-gray-300 p-2">Tổng tiền</th>
                </tr>
              </thead>
              <tbody>
                {selectedEmployee.details.length > 0 ? (
                  selectedEmployee.details.map((detail, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td className="border border-gray-300 p-2 text-center">
                          {detail.Ngay}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {detail.GioLamViec} giờ
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {formatCurrency(detail.LuongMotGio)}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                          {detail.HeSoLuong}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                          {detail.isCaDem ? "Ca đêm" : "Ca thường"}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                          {detail.isNgayLe
                            ? "Ngày lễ"
                            : detail.isCuoiTuan
                            ? "Cuối tuần"
                            : "Ngày thường"}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                          {formatCurrency(detail.TienLuongCa)}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                          <div className="flex items-center justify-between">
                            <span>{formatCurrency(detail.TienPhuCap)}</span>
                            {detail.detailsThuongPhat.length > 0 &&
                              detail.TienPhuCap > 0 && (
                                <button
                                  onClick={(e) => {
                                    toggleDetailExpansion(index);
                                  }}
                                  className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                  {expandedDetails[index] ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                          </div>
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                          <div className="flex items-center justify-between">
                            <span>{formatCurrency(detail.TienPhat)}</span>
                            {detail.detailsThuongPhat.length > 0 &&
                              detail.TienPhat > 0 && (
                                <button
                                  onClick={(e) => {
                                    toggleDetailExpansion(index);
                                  }}
                                  className="ml-2 text-red-600 hover:text-red-800"
                                >
                                  {expandedDetails[index] ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                          </div>
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                          {formatCurrency(detail.tongtien)}
                        </td>
                      </tr>
                      {expandedDetails[index] &&
                        detail.detailsThuongPhat.length > 0 && (
                          <tr>
                            <td
                              colSpan="10"
                              className="border border-gray-300 p-0"
                            >
                              <div className="bg-gray-50 p-3 border-t border-gray-200">
                                <h4 className="font-semibold text-sm mb-2 text-gray-700">
                                  Chi tiết thưởng/phạt ngày {detail.Ngay}:
                                </h4>
                                <div className="space-y-2">
                                  {detail.detailsThuongPhat.map(
                                    (ktkl, ktklIndex) => (
                                      <div
                                        key={ktklIndex}
                                        className={`p-2 rounded text-sm ${
                                          ktkl.ThuongPhat === true
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        <div className="flex justify-between items-center">
                                          <span className="font-medium">
                                            {ktkl.ThuongPhat
                                              ? "Thưởng"
                                              : "Phạt"}
                                            : {ktkl.LyDo}
                                          </span>
                                          <span className="font-bold">
                                            {formatCurrency(ktkl.MucThuongPhat)}
                                          </span>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10">Không có dữ liệu chấm công</td>
                  </tr>
                )}
                {phuCaps.length > 0 && (
                  <tr>
                    <td colSpan="10">
                      <div className="bg-gray-50 p-3 border-t border-gray-200">
                        <h4 className="font-semibold text-sm mb-2 text-gray-700">
                          Chi tiết phụ cấp:
                        </h4>
                        <div className="space-y-2">
                          {phuCaps.map((phuCap, index) => (
                            <div key={index} className="p-2 border-b border-gray-200">
                              <div className="flex justify-start gap-6 items-center">
                                <span className="font-medium">{phuCap.LoaiPhuCap}</span>
                                <span className="font-bold">{formatCurrency(phuCap.GiaTriPhuCap)}</span>
                                <span className="text-red-500">({phuCap.TrangThai? "Được miễn thuế" : "Không được miễn thuế" })</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="mt-4 flex justify-end gap-3">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
                onClick={handleExport}
              >
                <FileIcon size={18} className="mr-1" />
                <span>Xuất file</span>
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={closeModal}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhieuLuongsTab;
