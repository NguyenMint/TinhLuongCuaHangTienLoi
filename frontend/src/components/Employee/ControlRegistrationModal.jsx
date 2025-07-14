import React from "react";
import { X } from "lucide-react";
export const ControlRegistrationModal = ({lichLamViec, setShowControl,onHuyCa}) => {
    const getShiftTextColor = (shift) => {
        if (shift.TrangThai === "Đã Đăng Ký") return "text-green-600";
        if (shift.TrangThai === "Hủy Ca" || shift.TrangThai === "Từ Chối")
          return "text-red-600";
        if (shift.TrangThai === "Chờ Xác Nhận") return "text-orange-600";
        if (shift.TrangThai === "Chuyển Ca") return "text-yellow-600";
        return "text-black";
      };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold">Đăng ký ca</h2>
              </div>
              <button
                onClick={()=>{
                    setShowControl(false)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X/>
              </button>
            </div>
            <div className="p-4 border-b">
              <div className="grid grid-cols-4 gap-3 mt-4">
                <div>
                  <div className="text-sm text-gray-500">Thời gian</div>
                  <div className="font-medium">{lichLamViec.NgayLam}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-sm text-gray-500">Ca làm việc</div>
                  <div className="font-medium">
                    {lichLamViec.MaCaLam_ca_lam.TenCa} (
                    {lichLamViec.MaCaLam_ca_lam.ThoiGianBatDau} -{" "}
                    {lichLamViec.MaCaLam_ca_lam.ThoiGianKetThuc})
                  </div>
                </div>
                <div>
                <div className="text-sm text-gray-500">Trạng thái</div>
                <div className={`font-medium ${getShiftTextColor(lichLamViec)}`}>{lichLamViec.TrangThai}</div>
                </div>
              </div>
            </div>
    
            <div className="p-4 flex justify-center gap-2">
              <button
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
                onClick={()=>{setShowControl(false)}}
              >
                Bỏ qua
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={() => onHuyCa()}
              >
                Hủy đăng ký
              </button>
            </div>
          </div>
        </div>
      );
};
