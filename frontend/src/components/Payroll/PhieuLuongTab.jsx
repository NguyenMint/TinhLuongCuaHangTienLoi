import React, { useState } from "react";
import { formatCurrency } from "../../utils/format";

export const PhieuLuongsTab = ({ phieuLuong }) => {
  const [showTable, setShowTable] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});

  const toggleTable = () => {
    setShowTable(!showTable);
  };

  const toggleRow = (maBangLuong) => {
    setExpandedRows((prev) => ({
      ...prev,
      [maBangLuong]: !prev[maBangLuong],
    }));
  };
  return (
    <div className="text-center">
      <>
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
              <th className="border border-gray-300 p-2">Thuế</th>
              <th className="border border-gray-300 p-2">Lương Thực Nhận</th>
              {/* <th className="border border-gray-300 p-2">Chi Tiết</th> */}
            </tr>
          </thead>
          <tbody>
            {phieuLuong.map((employee) => (
              <React.Fragment key={employee.MaBangLuong}>
                <tr>
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
                    {formatCurrency(employee.ThuePhaiDong)}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {formatCurrency(employee.LuongThucNhan)}
                  </td>
                </tr>
                {expandedRows[employee.MaBangLuong] && (
                  <tr>
                    <td colSpan="9" className="border border-gray-300 p-2">
                      {employee.details.length > 0 ? (
                        <table className="w-full border-collapse border border-gray-200">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-200 p-1">
                                Ngày
                              </th>
                              <th className="border border-gray-200 p-1">
                                Giờ Làm
                              </th>
                              <th className="border border-gray-200 p-1">
                                Lương/Giờ
                              </th>
                              <th className="border border-gray-200 p-1">
                                Lương Ngày
                              </th>
                              <th className="border border-gray-200 p-1">
                                Phụ Cấp
                              </th>
                              <th className="border border-gray-200 p-1">
                                Phạt
                              </th>
                              <th className="border border-gray-200 p-1">
                                Tổng Tiền
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {employee.details.map((detail, index) => (
                              <tr key={index}>
                                <td className="border border-gray-200 p-1 text-center">
                                  {detail.Ngay}
                                </td>
                                <td className="border border-gray-200 p-1 text-center">
                                  {detail.GioLamViecTrongNgay}
                                </td>
                                <td className="border border-gray-200 p-1 text-right">
                                  {formatCurrency(detail.LuongMotGio)}
                                </td>
                                <td className="border border-gray-200 p-1 text-right">
                                  {formatCurrency(detail.TienLuongNgay)}
                                </td>
                                <td className="border border-gray-200 p-1 text-right">
                                  {formatCurrency(detail.TienPhuCap)}
                                </td>
                                <td className="border border-gray-200 p-1 text-right">
                                  {formatCurrency(detail.TienPhat)}
                                </td>
                                <td className="border border-gray-200 p-1 text-right">
                                  {formatCurrency(detail.tongtien)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-center text-gray-500">
                          Không có chi tiết hàng ngày
                        </p>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </>
    </div>
  );
};
