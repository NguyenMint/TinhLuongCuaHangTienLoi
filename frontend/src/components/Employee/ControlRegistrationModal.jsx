import React from "react";
import { X } from "lucide-react";
export const ControlRegistrationModal = ({
  lichLamViec,
  setShowControl,
  setShowLichLamViec,
  onHuyCa,
  huyXinChuyenCa,
}) => {
  const getShiftTextColor = (shift) => {
    if (shift.TrangThai === "Đã Đăng Ký") return "text-green-600";
    if (shift.TrangThai === "Hủy Ca" || shift.TrangThai === "Từ Chối")
      return "text-red-600";
    if (
      shift.TrangThai === "Chờ Xác Nhận" ||
      shift.TrangThai === "Chờ Duyệt Chuyển Ca"
    )
      return "text-orange-600";
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
            onClick={() => {
              setShowControl(false);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X />
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
              <div className={`font-medium ${getShiftTextColor(lichLamViec)}`}>
                {lichLamViec.TrangThai}
              </div>
            </div>
          </div>

          {(lichLamViec.TrangThai === "Chờ Duyệt Chuyển Ca" || lichLamViec.TrangThai === "Chuyển Ca") &&
            lichLamViec.MaLLVCu_lich_lam_viec && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border-l-4 border-orange-400">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Thông tin ca làm cũ:
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-gray-500">Ngày làm cũ</div>
                    <div className="font-medium">
                      {lichLamViec.MaLLVCu_lich_lam_viec.NgayLam}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Ca làm việc</div>
                    <div className="font-medium">
                      {lichLamViec.MaLLVCu_lich_lam_viec.MaCaLam_ca_lam.TenCa} (
                      {lichLamViec.MaLLVCu_lich_lam_viec.MaCaLam_ca_lam.ThoiGianBatDau} -{" "}
                      {lichLamViec.MaLLVCu_lich_lam_viec.MaCaLam_ca_lam.ThoiGianKetThuc})
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>

        <div className="p-4 flex justify-center gap-2">
          <button
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
            onClick={() => {
              setShowControl(false);
            }}
          >
            Bỏ qua
          </button>
          {lichLamViec.TrangThai === "Chờ Xác Nhận" && (
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              onClick={() => onHuyCa()}
            >
              Hủy đăng ký
            </button>
          )}
          {lichLamViec.TrangThai === "Đã Đăng Ký" && (
            <button
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              onClick={() => setShowLichLamViec(true)}
            >
              Xin chuyển ca
            </button>
          )}
          {lichLamViec.TrangThai === "Chờ Duyệt Chuyển Ca" && (
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              onClick={() => huyXinChuyenCa()}
            >
              Hủy chuyển ca
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
