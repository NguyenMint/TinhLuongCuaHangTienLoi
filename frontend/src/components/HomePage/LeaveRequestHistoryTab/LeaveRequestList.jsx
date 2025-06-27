import React, { useEffect, useState } from "react";
import { formatDate } from "../../../utils/format";
import { getDonXinNghiByNV } from "../../../api/apiNgayNghiPhep";
export const LeaveRequestTab = ({MaTK}) => {
  const [donXinNghis, setDonXinNghis] = useState([]);
  const fetchDonXinNghis = async () => {
    try {
        const response = await getDonXinNghiByNV(MaTK);
        setDonXinNghis(response);
        console.log(response);
      } catch (error) {
        console.log("Lỗi fetch đơn chờ duyệt: " + error);
      }
  }
  useEffect(()=>{
    fetchDonXinNghis();
  },[]);
  const getStatusColor = (status) => {
    switch (status) {
      case "Chờ duyệt":
        return "text-yellow-600 bg-yellow-100";
      case "Đã duyệt":
        return "text-green-600 bg-green-100";
      case "Từ chối":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };
  return (
    <div>
    <h3 className="text-lg font-semibold mb-4 text-gray-800">
      Lịch sử đơn xin nghỉ phép
    </h3>
    {donXinNghis.length === 0 ? (
      <div className="text-center py-8 text-gray-500">
        <p>Chưa có đơn xin nghỉ phép nào</p>
      </div>
    ) : (
      <div className="space-y-3">
        {donXinNghis.map((don) => (
          <div
            key={don.MaNNP}
            className="bg-white p-4 rounded-lg shadow-sm border"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Từ ngày:</span>
                    <p className="text-gray-800">
                      {formatDate(don.NgayBatDau)}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Đến ngày:</span>
                    <p className="text-gray-800">
                      {formatDate(don.NgayKetThuc)}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Số ngày:</span>
                    <p className="text-gray-800">{don.SoNgayNghi} ngày</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      Ngày đăng ký:
                    </span>
                    <p className="text-gray-800">
                      {formatDate(don.NgayDangKy)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="ml-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    don.TrangThai
                  )}`}
                >
                  {don.TrangThai}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
  );
};
