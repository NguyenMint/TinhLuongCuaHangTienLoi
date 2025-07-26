import React, { useEffect, useState } from "react";
import { duyetDon, tuChoiDon } from "../api/apiNgayNghiPhep";
import { toast } from "react-toastify";
export const LeaveRequestListModal = ({
  setShowModalDonXinNghis,
  requests,
  fecthRequests,
}) => {
  const [selected, setSelected] = useState([]);
  const [dangDuyet, setDangDuyet] = useState(false);
  const handleCheckAll = (e) => {
    if (e.target.checked) {
      setSelected(requests.map((req) => req.MaNNP));
    } else {
      setSelected([]);
    }
  };
  const handleCheck = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const handleDuyet = async () => {
    setDangDuyet(true);
    try {
      await Promise.all(selected.map((maNNP) => duyetDon(maNNP)));
      toast.success("Duyệt thành công!");
      setSelected([]);
      setShowModalDonXinNghis(false);
      fecthRequests();
    } catch (error) {
      console.log("Có lỗi khi từ chối đơn: ", error);
    }
    setDangDuyet(false);
  };
  const handleTuChoi = async () => {
    setDangDuyet(true);
    try {
      await Promise.all(selected.map((maNNP) => tuChoiDon(maNNP)));
      toast.success("Từ chối thành công!");
      setSelected([]);
      setShowModalDonXinNghis(false);
      fecthRequests();
    } catch (error) {
      console.log("Có lỗi khi từ chối đơn: ", error);
    }
    setDangDuyet(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl"
          onClick={() => {
            setShowModalDonXinNghis(false);
          }}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">
          Danh sách đơn xin nghỉ phép
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 border">
                  <input
                    type="checkbox"
                    checked={
                      selected.length === requests.length && requests.length > 0
                    }
                    onChange={handleCheckAll}
                  />
                </th>
                <th className="px-3 py-2 border">Mã NV</th>
                <th className="px-3 py-2 border">Tên nhân viên</th>
                <th className="px-3 py-2 border">Từ ngày</th>
                <th className="px-3 py-2 border">Đến ngày</th>
                <th className="px-3 py-2 border">Số ngày nghỉ</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    Không có đơn xin nghỉ phép nào.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr className="border-t">
                    <td className="px-3 py-2 border text-center">
                      <input
                        type="checkbox"
                        checked={selected.includes(req.MaNNP)}
                        onChange={() => handleCheck(req.MaNNP)}
                      />
                    </td>
                    <td className="px-3 py-2 border">
                      {req.MaTK_tai_khoan?.MaNhanVien}
                    </td>
                    <td className="px-3 py-2 border">
                      {req.MaTK_tai_khoan?.HoTen}
                    </td>
                    <td className="px-3 py-2 border">
                      {new Date(req.NgayBatDau).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-3 py-2 border">
                      {new Date(req.NgayKetThuc).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-3 py-2 border text-center">
                      {req.SoNgayNghi}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex justify-end gap-2 mt-6">
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={handleDuyet}
              disabled={selected.length === 0 || dangDuyet}
            >
              Duyệt
            </button>
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={handleTuChoi}
              disabled={selected.length === 0 || dangDuyet}
            >
              Từ chối
            </button>
            <button
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => {
                setShowModalDonXinNghis(false);
              }}
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
